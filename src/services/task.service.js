const mongoose = require("mongoose");

const Task = require("../models/Task");
const Project = require("../models/Project");
const Workspace = require("../models/Workspace");
const WorkspaceMember = require("../models/WorkspaceMember");
const User = require("../models/User");

const ApiError =
    require("../utils/ApiError");


/*
 * Escape regex characters for safe search.
 */
const escapeRegex = (value) => {
    return value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
};


/*
 * Ensure workspace exists.
 */
const ensureWorkspaceExists = async (
    workspaceId
) => {
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
 * Ensure project belongs to workspace.
 */
const ensureProjectExists = async ({
    workspaceId,
    projectId
}) => {
    const project =
        await Project.findOne({
            _id: projectId,
            workspace: workspaceId,
            isActive: true,
            deletedAt: null
        }).lean();

    if (!project) {
        throw new ApiError(
            404,
            "Project not found"
        );
    }

    return project;
};


/*
 * Ensure user exists and is active.
 */
const ensureUserExists = async (
    userId
) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(
            400,
            "Invalid user ID"
        );
    }

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
 * Ensure assignee belongs to workspace.
 */
const ensureWorkspaceMember = async ({
    workspaceId,
    userId
}) => {
    if (!userId) {
        return null;
    }

    await ensureUserExists(userId);

    const member =
        await WorkspaceMember.findOne({
            workspace: workspaceId,
            user: userId
        }).lean();

    if (!member) {
        throw new ApiError(
            400,
            "Assignee must be a member of this workspace"
        );
    }

    return member;
};


/*
 * CREATE TASK
 */
const createTask = async ({
    workspaceId,
    projectId,
    userId,
    title,
    description = "",
    status,
    priority,
    assignee = null,
    dueDate = null,
    tags = []
}) => {
    await ensureWorkspaceExists(
        workspaceId
    );

    await ensureProjectExists({
        workspaceId,
        projectId
    });

    await ensureUserExists(userId);

    if (assignee) {
        await ensureWorkspaceMember({
            workspaceId,
            userId: assignee
        });
    }

    const task =
        await Task.create({
            workspace: workspaceId,
            project: projectId,
            title: title.trim(),
            description: description.trim(),
            status,
            priority,
            assignee,
            reporter: userId,
            dueDate,
            tags
        });

    return Task.findOne({
        _id: task._id,
        workspace: workspaceId,
        project: projectId,
        isActive: true,
        deletedAt: null
    })
        .populate(
            "assignee",
            "name email avatar"
        )
        .populate(
            "reporter",
            "name email avatar"
        )
        .populate(
            "project",
            "name key"
        )
        .populate(
            "workspace",
            "name slug"
        );
};


/*
 * GET TASKS
 */
const getTasks = async ({
    workspaceId,
    projectId,
    page = 1,
    limit = 20,
    search = "",
    status,
    priority,
    assignee,
    tag,
    sortBy = "createdAt",
    sortOrder = "desc"
}) => {
    await ensureWorkspaceExists(
        workspaceId
    );

    await ensureProjectExists({
        workspaceId,
        projectId
    });

    const currentPage =
        Number(page);

    const currentLimit =
        Number(limit);

    const skip =
        (currentPage - 1) *
        currentLimit;

    const filter = {
        workspace: workspaceId,
        project: projectId,
        isActive: true,
        deletedAt: null
    };


    /*
     * Status filter
     */
    if (status) {
        filter.status = status;
    }


    /*
     * Priority filter
     */
    if (priority) {
        filter.priority = priority;
    }


    /*
     * Assignee filter
     */
    if (assignee) {
        await ensureWorkspaceMember({
            workspaceId,
            userId: assignee
        });

        filter.assignee = assignee;
    }


    /*
     * Tag filter
     */
    if (tag) {
        filter.tags = tag;
    }


    /*
     * Search
     */
    if (search && search.trim()) {
        const safeSearch =
            escapeRegex(
                search.trim()
            );

        const searchRegex =
            new RegExp(
                safeSearch,
                "i"
            );

        filter.$or = [
            {
                title: searchRegex
            },
            {
                description: searchRegex
            }
        ];
    }


    /*
     * Allowed sorting fields
     */
    const allowedSortFields = {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        title: "title",
        priority: "priority",
        status: "status",
        dueDate: "dueDate"
    };

    const safeSortField =
        allowedSortFields[sortBy]
        || "createdAt";

    const safeSortOrder =
        sortOrder === "asc"
            ? 1
            : -1;


    const [
        tasks,
        total
    ] = await Promise.all([
        Task.find(filter)
            .populate(
                "assignee",
                "name email avatar"
            )
            .populate(
                "reporter",
                "name email avatar"
            )
            .sort({
                [safeSortField]:
                    safeSortOrder
            })
            .skip(skip)
            .limit(currentLimit)
            .lean(),

        Task.countDocuments(filter)
    ]);


    const totalPages =
        Math.ceil(
            total / currentLimit
        );


    return {
        tasks,

        pagination: {
            page: currentPage,
            limit: currentLimit,
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
 * GET SINGLE TASK
 */
const getTaskById = async ({
    workspaceId,
    projectId,
    taskId
}) => {
    await ensureWorkspaceExists(
        workspaceId
    );

    await ensureProjectExists({
        workspaceId,
        projectId
    });

    const task =
        await Task.findOne({
            _id: taskId,
            workspace: workspaceId,
            project: projectId,
            isActive: true,
            deletedAt: null
        })
            .populate(
                "assignee",
                "name email avatar"
            )
            .populate(
                "reporter",
                "name email avatar"
            )
            .populate(
                "project",
                "name key"
            )
            .populate(
                "workspace",
                "name slug"
            )
            .lean();

    if (!task) {
        throw new ApiError(
            404,
            "Task not found"
        );
    }

    return task;
};


/*
 * UPDATE TASK
 */
const updateTask = async ({
    workspaceId,
    projectId,
    taskId,
    updates
}) => {
    await ensureWorkspaceExists(
        workspaceId
    );

    await ensureProjectExists({
        workspaceId,
        projectId
    });

    const task =
        await Task.findOne({
            _id: taskId,
            workspace: workspaceId,
            project: projectId,
            isActive: true,
            deletedAt: null
        });

    if (!task) {
        throw new ApiError(
            404,
            "Task not found"
        );
    }


    /*
     * Validate assignee
     */
    if (
        updates.assignee !== undefined &&
        updates.assignee !== null
    ) {
        await ensureWorkspaceMember({
            workspaceId,
            userId: updates.assignee
        });
    }


    /*
     * Update fields
     */
    if (updates.title !== undefined) {
        task.title =
            updates.title.trim();
    }

    if (
        updates.description !==
        undefined
    ) {
        task.description =
            updates.description.trim();
    }

    if (
        updates.status !== undefined
    ) {
        task.status =
            updates.status;
    }

    if (
        updates.priority !== undefined
    ) {
        task.priority =
            updates.priority;
    }

    if (
        updates.assignee !== undefined
    ) {
        task.assignee =
            updates.assignee;
    }

    if (
        updates.dueDate !== undefined
    ) {
        task.dueDate =
            updates.dueDate;
    }

    if (
        updates.tags !== undefined
    ) {
        task.tags =
            updates.tags;
    }


    await task.save();


    return Task.findOne({
        _id: task._id,
        workspace: workspaceId,
        project: projectId,
        isActive: true,
        deletedAt: null
    })
        .populate(
            "assignee",
            "name email avatar"
        )
        .populate(
            "reporter",
            "name email avatar"
        )
        .populate(
            "project",
            "name key"
        )
        .populate(
            "workspace",
            "name slug"
        );
};


/*
 * DELETE TASK
 */
const deleteTask = async ({
    workspaceId,
    projectId,
    taskId
}) => {
    await ensureWorkspaceExists(
        workspaceId
    );

    await ensureProjectExists({
        workspaceId,
        projectId
    });

    const task =
        await Task.findOne({
            _id: taskId,
            workspace: workspaceId,
            project: projectId,
            isActive: true,
            deletedAt: null
        });

    if (!task) {
        throw new ApiError(
            404,
            "Task not found"
        );
    }

    task.isActive = false;
    task.deletedAt = new Date();

    await task.save();

    return {
        message:
            "Task deleted successfully"
    };
};


module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};

