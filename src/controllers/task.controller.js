const asyncHandler =
    require("../utils/asyncHandler");


const {
    createTask:
    createTaskService,

    getTasks:
    getTasksService,

    getTaskById:
    getTaskByIdService,

    updateTask:
    updateTaskService,

    deleteTask:
    deleteTaskService

} = require("../services/task.service");


/*
 * CREATE TASK
 */
const createTask =
    asyncHandler(
        async (req, res) => {
            const task =
                await createTaskService({
                    workspaceId:
                        req.params.workspaceId,

                    projectId:
                        req.params.projectId,

                    userId:
                        req.user.id,

                    title:
                        req.body.title,

                    description:
                        req.body.description,

                    status:
                        req.body.status,

                    priority:
                        req.body.priority,

                    assignee:
                        req.body.assignee,

                    dueDate:
                        req.body.dueDate,

                    tags:
                        req.body.tags
                });


            res.status(201).json({
                success: true,

                message:
                    "Task created successfully",

                data: task
            });
        }
    );


/*
 * GET TASKS
 */
const getTasks =
    asyncHandler(
        async (req, res) => {
            const result =
                await getTasksService({
                    workspaceId:
                        req.params.workspaceId,

                    projectId:
                        req.params.projectId,

                    page:
                        req.query.page,

                    limit:
                        req.query.limit,

                    search:
                        req.query.search,

                    status:
                        req.query.status,

                    priority:
                        req.query.priority,

                    assignee:
                        req.query.assignee,

                    tag:
                        req.query.tag,

                    sortBy:
                        req.query.sortBy,

                    sortOrder:
                        req.query.sortOrder
                });


            res.status(200).json({
                success: true,

                data:
                    result.tasks,

                pagination:
                    result.pagination
            });
        }
    );


/*
 * GET SINGLE TASK
 */
const getTask =
    asyncHandler(
        async (req, res) => {
            const task =
                await getTaskByIdService({
                    workspaceId:
                        req.params.workspaceId,

                    projectId:
                        req.params.projectId,

                    taskId:
                        req.params.taskId
                });


            res.status(200).json({
                success: true,

                data: task
            });
        }
    );


/*
 * UPDATE TASK
 */
const updateTask =
    asyncHandler(
        async (req, res) => {
            const task =
                await updateTaskService({
                    workspaceId:
                        req.params.workspaceId,

                    projectId:
                        req.params.projectId,

                    taskId:
                        req.params.taskId,

                    updates:
                        req.body
                });


            res.status(200).json({
                success: true,

                message:
                    "Task updated successfully",

                data: task
            });
        }
    );


/*
 * DELETE TASK
 */
const deleteTask =
    asyncHandler(
        async (req, res) => {
            const result =
                await deleteTaskService({
                    workspaceId:
                        req.params.workspaceId,

                    projectId:
                        req.params.projectId,

                    taskId:
                        req.params.taskId
                });


            res.status(200).json({
                success: true,

                message:
                    result.message
            });
        }
    );


module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
};

