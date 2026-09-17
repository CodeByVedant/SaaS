const Project = require("../models/Project");
const Workspace = require("../models/Workspace");
const User = require("../models/User");

const ApiError = require("../utils/ApiError");


/*
 * =========================================================
 * ENSURE WORKSPACE EXISTS
 * =========================================================
 */
const ensureWorkspaceExists = async (workspaceId) => {

    const workspace =
        await Workspace.findOne({
            _id: workspaceId,
            isActive: true,
            deletedAt: null
        }).lean();


    if (!workspace) {
        throw new ApiError(
            404,
            "Workspace not found"
        );
    }


    return workspace;
};


/*
 * =========================================================
 * ENSURE USER EXISTS
 * =========================================================
 */
const ensureUserExists = async (userId) => {

    const user =
        await User.findOne({
            _id: userId,
            isActive: true
        }).lean();


    if (!user) {
        throw new ApiError(
            404,
            "User not found or inactive"
        );
    }


    return user;
};


/*
 * =========================================================
 * CREATE PROJECT
 * =========================================================
 */
const createProject = async ({
    workspaceId,
    userId,
    key,
    name,
    description = ""
}) => {

    await ensureWorkspaceExists(
        workspaceId
    );


    await ensureUserExists(
        userId
    );


    const normalizedKey =
        key.trim().toUpperCase();


    /*
     * Check duplicate key inside
     * the current workspace only.
     */
    const existingProject =
        await Project.findOne({
            workspace: workspaceId,
            key: normalizedKey,
            isActive: true,
            deletedAt: null
        }).lean();


    if (existingProject) {

        throw new ApiError(
            409,
            "A project with this key already exists in this workspace"
        );
    }


    try {

        const project =
            await Project.create({

                workspace:
                    workspaceId,

                key:
                    normalizedKey,

                name:
                    name.trim(),

                description:
                    description.trim(),

                createdBy:
                    userId
            });


        return Project.findById(
            project._id
        )
            .populate(
                "createdBy",
                "name email avatar"
            )
            .populate(
                "workspace",
                "name slug"
            );

    } catch (error) {

        /*
         * MongoDB compound unique index
         * is the final protection.
         */
        if (error.code === 11000) {

            throw new ApiError(
                409,
                "A project with this key already exists in this workspace"
            );
        }

        throw error;
    }
};


/*
 * =========================================================
 * GET PROJECTS
 * =========================================================
 */
const getProjects = async ({
    workspaceId,
    page = 1,
    limit = 10,
    search = "",
    archived,
    sortBy = "createdAt",
    sortOrder = "desc"
}) => {

    await ensureWorkspaceExists(
        workspaceId
    );


    const currentPage =
        Number(page);

    const currentLimit =
        Number(limit);


    const skip =
        (currentPage - 1) *
        currentLimit;


    /*
     * IMPORTANT:
     *
     * Every query is scoped
     * to workspace.
     */
    const filter = {

        workspace:
            workspaceId,

        isActive:
            true,

        deletedAt:
            null
    };


    /*
     * Archived filter
     */
    if (
        typeof archived === "boolean"
    ) {

        filter.isArchived =
            archived;
    }


    /*
     * Search by project name
     * or project key.
     */
    if (
        search &&
        search.trim()
    ) {

        const searchRegex =
            new RegExp(
                search.trim(),
                "i"
            );


        filter.$or = [

            {
                name:
                    searchRegex
            },

            {
                key:
                    searchRegex
            }
        ];
    }


    /*
     * Allowlist sorting fields.
     */
    const allowedSortFields = {

        createdAt:
            "createdAt",

        updatedAt:
            "updatedAt",

        name:
            "name",

        key:
            "key"
    };


    const safeSortField =
        allowedSortFields[
            sortBy
        ] || "createdAt";


    const safeSortOrder =
        sortOrder === "asc"
            ? 1
            : -1;


    const [
        projects,
        total
    ] = await Promise.all([

        Project.find(filter)

            .populate(
                "createdBy",
                "name email avatar"
            )

            .sort({
                [safeSortField]:
                    safeSortOrder
            })

            .skip(skip)

            .limit(currentLimit)

            .lean(),


        Project.countDocuments(
            filter
        )
    ]);


    const totalPages =
        Math.ceil(
            total / currentLimit
        );


    return {

        projects,

        pagination: {

            page:
                currentPage,

            limit:
                currentLimit,

            total,

            totalPages,

            hasNextPage:
                currentPage <
                totalPages,

            hasPreviousPage:
                currentPage > 1
        }
    };
};


/*
 * =========================================================
 * GET SINGLE PROJECT
 * =========================================================
 */
const getProjectById = async ({
    workspaceId,
    projectId
}) => {

    await ensureWorkspaceExists(
        workspaceId
    );


    /*
     * VERY IMPORTANT:
     *
     * Do NOT use:
     *
     * Project.findById(projectId)
     *
     * because that could allow
     * cross-tenant access.
     */
    const project =
        await Project.findOne({

            _id:
                projectId,

            workspace:
                workspaceId,

            isActive:
                true,

            deletedAt:
                null

        })

        .populate(
            "createdBy",
            "name email avatar"
        )

        .populate(
            "workspace",
            "name slug"
        )

        .lean();


    if (!project) {

        throw new ApiError(
            404,
            "Project not found"
        );
    }


    return project;
};


/*
 * =========================================================
 * UPDATE PROJECT
 * =========================================================
 */
const updateProject = async ({
    workspaceId,
    projectId,
    updates
}) => {

    await ensureWorkspaceExists(
        workspaceId
    );


    /*
     * Workspace-scoped lookup.
     */
    const project =
        await Project.findOne({

            _id:
                projectId,

            workspace:
                workspaceId,

            isActive:
                true,

            deletedAt:
                null

        });


    if (!project) {

        throw new ApiError(
            404,
            "Project not found"
        );
    }


    /*
     * UPDATE KEY
     */
    if (
        updates.key !== undefined
    ) {

        const normalizedKey =
            updates.key
                .trim()
                .toUpperCase();


        if (
            normalizedKey !==
            project.key
        ) {

            const duplicate =
                await Project.findOne({

                    workspace:
                        workspaceId,

                    key:
                        normalizedKey,

                    _id:
                        {
                            $ne:
                                projectId
                        },

                    isActive:
                        true,

                    deletedAt:
                        null

                }).lean();


            if (duplicate) {

                throw new ApiError(
                    409,
                    "A project with this key already exists in this workspace"
                );
            }


            project.key =
                normalizedKey;
        }
    }


    /*
     * UPDATE NAME
     */
    if (
        updates.name !== undefined
    ) {

        project.name =
            updates.name.trim();
    }


    /*
     * UPDATE DESCRIPTION
     */
    if (
        updates.description !==
        undefined
    ) {

        project.description =
            updates.description.trim();
    }


    /*
     * ARCHIVE / UNARCHIVE
     */
    if (
        updates.isArchived !==
        undefined
    ) {

        project.isArchived =
            updates.isArchived;
    }


    try {

        await project.save();

    } catch (error) {

        if (
            error.code === 11000
        ) {

            throw new ApiError(
                409,
                "A project with this key already exists in this workspace"
            );
        }

        throw error;
    }


    return Project.findById(
        project._id
    )

        .populate(
            "createdBy",
            "name email avatar"
        )

        .populate(
            "workspace",
            "name slug"
        );
};


/*
 * =========================================================
 * DELETE PROJECT
 * =========================================================
 */
const deleteProject = async ({
    workspaceId,
    projectId
}) => {

    await ensureWorkspaceExists(
        workspaceId
    );


    /*
     * Workspace-scoped lookup.
     */
    const project =
        await Project.findOne({

            _id:
                projectId,

            workspace:
                workspaceId,

            isActive:
                true,

            deletedAt:
                null

        });


    if (!project) {

        throw new ApiError(
            404,
            "Project not found"
        );
    }


    /*
     * Soft delete.
     */
    project.isActive =
        false;

    project.deletedAt =
        new Date();


    await project.save();


    return {
        message:
            "Project deleted successfully"
    };
};


module.exports = {

    createProject,

    getProjects,

    getProjectById,

    updateProject,

    deleteProject
};




// const Project = require("../models/Project");
// const Workspace = require("../models/Workspace");
// const WorkspaceMember = require("../models/WorkspaceMember");
// const User = require("../models/User");

// const {
//     USER_ROLES
// } = require("../utils/constants");

// const ApiError = require("../utils/ApiError");


// /*
//  * ---------------------------------------------------------
//  * HELPER: ENSURE WORKSPACE EXISTS
//  * ---------------------------------------------------------
//  */
// const ensureWorkspaceExists = async (workspaceId) => {
//     const workspace = await Workspace.findOne({
//         _id: workspaceId,
//         isActive: true,
//         deletedAt: null
//     }).lean();

//     if (!workspace) {
//         throw new ApiError(404, "Workspace not found");
//     }

//     return workspace;
// };


// /*
//  * ---------------------------------------------------------
//  * HELPER: ENSURE USER EXISTS
//  * ---------------------------------------------------------
//  */
// const ensureUserExists = async (userId) => {
//     const user = await User.findOne({
//         _id: userId,
//         isActive: true
//     }).lean();

//     if (!user) {
//         throw new ApiError(404, "User not found or inactive");
//     }

//     return user;
// };


// /*
//  * ---------------------------------------------------------
//  * CREATE PROJECT
//  * ---------------------------------------------------------
//  */
// const createProject = async ({
//     workspaceId,
//     userId,
//     key,
//     name,
//     description = ""
// }) => {

//     await ensureWorkspaceExists(workspaceId);

//     await ensureUserExists(userId);

//     const normalizedKey = key.trim().toUpperCase();

//     /*
//      * IMPORTANT:
//      * The key is checked together with workspace.
//      *
//      * This allows:
//      *
//      * Workspace A -> CRM
//      * Workspace B -> CRM
//      */
//     const existingProject = await Project.findOne({
//         workspace: workspaceId,
//         key: normalizedKey,
//         isActive: true
//     }).lean();

//     if (existingProject) {
//         throw new ApiError(
//             409,
//             "A project with this key already exists in this workspace"
//         );
//     }

//     try {
//         const project = await Project.create({
//             workspace: workspaceId,
//             key: normalizedKey,
//             name: name.trim(),
//             description: description.trim(),
//             createdBy: userId
//         });

//         return Project.findById(project._id)
//             .populate("createdBy", "name email avatar")
//             .populate("workspace", "name slug");
//     } catch (error) {

//         /*
//          * MongoDB unique index protection.
//          */
//         if (error.code === 11000) {
//             throw new ApiError(
//                 409,
//                 "A project with this key already exists in this workspace"
//             );
//         }

//         throw error;
//     }
// };


// /*
//  * ---------------------------------------------------------
//  * GET PROJECTS
//  * ---------------------------------------------------------
//  */
// const getProjects = async ({
//     workspaceId,
//     page = 1,
//     limit = 10,
//     search = "",
//     archived,
//     sortBy = "createdAt",
//     sortOrder = "desc"
// }) => {

//     await ensureWorkspaceExists(workspaceId);

//     const currentPage = Number(page);
//     const currentLimit = Number(limit);

//     const skip =
//         (currentPage - 1) * currentLimit;

//     /*
//      * TENANT ISOLATION
//      *
//      * Every project query contains workspace.
//      */
//     const filter = {
//         workspace: workspaceId,
//         isActive: true,
//         deletedAt: null
//     };


//     /*
//      * Archived filtering
//      */
//     if (typeof archived === "boolean") {
//         filter.isArchived = archived;
//     }


//     /*
//      * Search
//      */
//     if (search && search.trim()) {

//         const searchRegex =
//             new RegExp(search.trim(), "i");

//         filter.$or = [
//             {
//                 name: searchRegex
//             },
//             {
//                 key: searchRegex
//             }
//         ];
//     }


//     /*
//      * Allowlisted sorting.
//      *
//      * Never directly trust req.query.sortBy
//      * as a MongoDB field.
//      */
//     const allowedSortFields = {
//         createdAt: "createdAt",
//         updatedAt: "updatedAt",
//         name: "name",
//         key: "key"
//     };

//     const safeSortField =
//         allowedSortFields[sortBy] || "createdAt";

//     const safeSortOrder =
//         sortOrder === "asc" ? 1 : -1;


//     const [projects, total] = await Promise.all([

//         Project.find(filter)
//             .populate(
//                 "createdBy",
//                 "name email avatar"
//             )
//             .sort({
//                 [safeSortField]: safeSortOrder
//             })
//             .skip(skip)
//             .limit(currentLimit)
//             .lean(),

//         Project.countDocuments(filter)
//     ]);


//     const totalPages =
//         Math.ceil(total / currentLimit);


//     return {
//         projects,

//         pagination: {
//             page: currentPage,
//             limit: currentLimit,
//             total,
//             totalPages,
//             hasNextPage:
//                 currentPage < totalPages,
//             hasPreviousPage:
//                 currentPage > 1
//         }
//     };
// };


// /*
//  * ---------------------------------------------------------
//  * GET SINGLE PROJECT
//  * ---------------------------------------------------------
//  */
// const getProjectById = async ({
//     workspaceId,
//     projectId
// }) => {

//     await ensureWorkspaceExists(workspaceId);

//     /*
//      * SECURITY:
//      *
//      * NEVER:
//      *
//      * Project.findById(projectId)
//      *
//      * Instead:
//      *
//      * _id + workspace
//      */
//     const project = await Project.findOne({
//         _id: projectId,
//         workspace: workspaceId,
//         isActive: true,
//         deletedAt: null
//     })
//         .populate(
//             "createdBy",
//             "name email avatar"
//         )
//         .populate(
//             "workspace",
//             "name slug"
//         )
//         .lean();

//     if (!project) {
//         throw new ApiError(404, "Project not found");
//     }

//     return project;
// };


// /*
//  * ---------------------------------------------------------
//  * UPDATE PROJECT
//  * ---------------------------------------------------------
//  */
// const updateProject = async ({
//     workspaceId,
//     projectId,
//     updates
// }) => {

//     await ensureWorkspaceExists(workspaceId);

//     /*
//      * ALWAYS scope project by workspace.
//      */
//     const project = await Project.findOne({
//         _id: projectId,
//         workspace: workspaceId,
//         isActive: true,
//         deletedAt: null
//     });

//     if (!project) {
//         throw new ApiError(404, "Project not found");
//     }


//     /*
//      * KEY UPDATE
//      */
//     if (updates.key !== undefined) {

//         const normalizedKey =
//             updates.key.trim().toUpperCase();

//         if (normalizedKey !== project.key) {

//             const duplicate =
//                 await Project.findOne({
//                     workspace: workspaceId,
//                     key: normalizedKey,
//                     _id: { $ne: projectId },
//                     isActive: true,
//                     deletedAt: null
//                 }).lean();

//             if (duplicate) {
//                 throw new ApiError(
//                     409,
//                     "A project with this key already exists in this workspace"
//                 );
//             }

//             project.key = normalizedKey;
//         }
//     }


//     /*
//      * NAME
//      */
//     if (updates.name !== undefined) {
//         project.name = updates.name.trim();
//     }


//     /*
//      * DESCRIPTION
//      */
//     if (updates.description !== undefined) {
//         project.description =
//             updates.description.trim();
//     }


//     /*
//      * ARCHIVE
//      */
//     if (updates.isArchived !== undefined) {
//         project.isArchived =
//             updates.isArchived;
//     }


//     try {

//         await project.save();

//     } catch (error) {

//         if (error.code === 11000) {
//             throw new ApiError(
//                 409,
//                 "A project with this key already exists in this workspace"
//             );
//         }

//         throw error;
//     }


//     return Project.findById(project._id)
//         .populate(
//             "createdBy",
//             "name email avatar"
//         )
//         .populate(
//             "workspace",
//             "name slug"
//         );
// };


// /*
//  * ---------------------------------------------------------
//  * SOFT DELETE PROJECT
//  * ---------------------------------------------------------
//  */
// const deleteProject = async ({
//     workspaceId,
//     projectId
// }) => {

//     await ensureWorkspaceExists(workspaceId);

//     /*
//      * TENANT ISOLATION
//      */
//     const project = await Project.findOne({
//         _id: projectId,
//         workspace: workspaceId,
//         isActive: true,
//         deletedAt: null
//     });

//     if (!project) {
//         throw new ApiError(404, "Project not found");
//     }


//     project.isActive = false;
//     project.deletedAt = new Date();

//     await project.save();


//     return {
//         message: "Project deleted successfully"
//     };
// };


// module.exports = {
//     createProject,
//     getProjects,
//     getProjectById,
//     updateProject,
//     deleteProject
// };
