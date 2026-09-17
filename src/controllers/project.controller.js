const asyncHandler =
    require("../utils/asyncHandler");


const {
    createProject:
    createProjectService,

    getProjects:
    getProjectsService,

    getProjectById:
    getProjectByIdService,

    updateProject:
    updateProjectService,

    deleteProject:
    deleteProjectService

} = require("../services/project.service");


/*
 * =========================================================
 * CREATE PROJECT
 * =========================================================
 */
const createProject =
    asyncHandler(
        async (req, res) => {

            const project =
                await createProjectService({

                    workspaceId:
                        req.params.workspaceId,

                    userId:
                        req.user.id,

                    key:
                        req.body.key,

                    name:
                        req.body.name,

                    description:
                        req.body.description
                });


            res.status(201).json({

                success:
                    true,

                message:
                    "Project created successfully",

                data:
                    project
            });
        }
    );


/*
 * =========================================================
 * GET PROJECTS
 * =========================================================
 */
const getProjects =
    asyncHandler(
        async (req, res) => {

            const result =
                await getProjectsService({

                    workspaceId:
                        req.params.workspaceId,

                    page:
                        req.query.page,

                    limit:
                        req.query.limit,

                    search:
                        req.query.search,

                    archived:
                        req.query.archived,

                    sortBy:
                        req.query.sortBy,

                    sortOrder:
                        req.query.sortOrder
                });


            res.status(200).json({

                success:
                    true,

                data:
                    result.projects,

                pagination:
                    result.pagination
            });
        }
    );


/*
 * =========================================================
 * GET SINGLE PROJECT
 * =========================================================
 */
const getProject =
    asyncHandler(
        async (req, res) => {

            const project =
                await getProjectByIdService({

                    workspaceId:
                        req.params.workspaceId,

                    projectId:
                        req.params.projectId
                });


            res.status(200).json({

                success:
                    true,

                data:
                    project
            });
        }
    );


/*
 * =========================================================
 * UPDATE PROJECT
 * =========================================================
 */
const updateProject =
    asyncHandler(
        async (req, res) => {

            const project =
                await updateProjectService({

                    workspaceId:
                        req.params.workspaceId,

                    projectId:
                        req.params.projectId,

                    updates:
                        req.body
                });


            res.status(200).json({

                success:
                    true,

                message:
                    "Project updated successfully",

                data:
                    project
            });
        }
    );


/*
 * =========================================================
 * DELETE PROJECT
 * =========================================================
 */
const deleteProject =
    asyncHandler(
        async (req, res) => {

            const result =
                await deleteProjectService({

                    workspaceId:
                        req.params.workspaceId,

                    projectId:
                        req.params.projectId
                });


            res.status(200).json({

                success:
                    true,

                message:
                    result.message
            });
        }
    );


module.exports = {

    createProject,

    getProjects,

    getProject,

    updateProject,

    deleteProject
};



// const asyncHandler = require("../utils/asyncHandler");

// const {
//     createProject: createProjectService,
//     getProjects: getProjectsService,
//     getProjectById: getProjectByIdService,
//     updateProject: updateProjectService,
//     deleteProject: deleteProjectService
// } = require("../services/project.service");


// /*
//  * ---------------------------------------------------------
//  * CREATE PROJECT
//  * ---------------------------------------------------------
//  */
// const createProject = asyncHandler(
//     async (req, res) => {

//         const project =
//             await createProjectService({
//                 workspaceId:
//                     req.params.workspaceId,

//                 userId:
//                     req.user.id,

//                 key:
//                     req.body.key,

//                 name:
//                     req.body.name,

//                 description:
//                     req.body.description
//             });


//         res.status(201).json({
//             success: true,
//             message: "Project created successfully",
//             data: project
//         });
//     }
// );


// /*
//  * ---------------------------------------------------------
//  * GET PROJECTS
//  * ---------------------------------------------------------
//  */
// const getProjects = asyncHandler(
//     async (req, res) => {

//         const result =
//             await getProjectsService({
//                 workspaceId:
//                     req.params.workspaceId,

//                 page:
//                     req.query.page,

//                 limit:
//                     req.query.limit,

//                 search:
//                     req.query.search,

//                 archived:
//                     req.query.archived,

//                 sortBy:
//                     req.query.sortBy,

//                 sortOrder:
//                     req.query.sortOrder
//             });


//         res.status(200).json({
//             success: true,
//             data: result.projects,
//             pagination: result.pagination
//         });
//     }
// );


// /*
//  * ---------------------------------------------------------
//  * GET SINGLE PROJECT
//  * ---------------------------------------------------------
//  */
// const getProject = asyncHandler(
//     async (req, res) => {

//         const project =
//             await getProjectByIdService({
//                 workspaceId:
//                     req.params.workspaceId,

//                 projectId:
//                     req.params.projectId
//             });


//         res.status(200).json({
//             success: true,
//             data: project
//         });
//     }
// );


// /*
//  * ---------------------------------------------------------
//  * UPDATE PROJECT
//  * ---------------------------------------------------------
//  */
// const updateProject = asyncHandler(
//     async (req, res) => {

//         const project =
//             await updateProjectService({
//                 workspaceId:
//                     req.params.workspaceId,

//                 projectId:
//                     req.params.projectId,

//                 updates:
//                     req.body
//             });


//         res.status(200).json({
//             success: true,
//             message: "Project updated successfully",
//             data: project
//         });
//     }
// );


// /*
//  * ---------------------------------------------------------
//  * DELETE PROJECT
//  * ---------------------------------------------------------
//  */
// const deleteProject = asyncHandler(
//     async (req, res) => {

//         const result =
//             await deleteProjectService({
//                 workspaceId:
//                     req.params.workspaceId,

//                 projectId:
//                     req.params.projectId
//             });


//         res.status(200).json({
//             success: true,
//             message: result.message
//         });
//     }
// );


// module.exports = {
//     createProject,
//     getProjects,
//     getProject,
//     updateProject,
//     deleteProject
// };

