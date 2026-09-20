const express =
    require("express");


const router =
    express.Router({
        mergeParams: true
    });


const protect =
    require("../middlewares/auth.middleware");


const validate =
    require("../middlewares/validate.middleware");


const {
    loadWorkspaceMember,
    authorizeRoles,
    ownerOrAdmin
} = require("../middlewares/workspace.middleware");


const {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
} = require("../controllers/task.controller");


const {
    createTaskSchema,
    listTasksSchema,
    taskIdSchema,
    updateTaskSchema
} = require("../validators/task.validator");


const {
    USER_ROLES
} = require("../utils/constants");


/*
 * CREATE TASK
 *
 * Owner + Admin + Member
 */
router.post(
    "/",
    protect,

    validate(
        createTaskSchema
    ),

    loadWorkspaceMember,

    authorizeRoles(
        USER_ROLES.OWNER,
        USER_ROLES.ADMIN,
        USER_ROLES.MEMBER
    ),

    createTask
);


/*
 * GET ALL TASKS
 *
 * All roles
 */
router.get(
    "/",
    protect,

    validate(
        listTasksSchema
    ),

    loadWorkspaceMember,

    authorizeRoles(
        USER_ROLES.OWNER,
        USER_ROLES.ADMIN,
        USER_ROLES.MEMBER,
        USER_ROLES.VIEWER
    ),

    getTasks
);


/*
 * GET SINGLE TASK
 *
 * All roles
 */
router.get(
    "/:taskId",
    protect,

    validate(
        taskIdSchema
    ),

    loadWorkspaceMember,

    authorizeRoles(
        USER_ROLES.OWNER,
        USER_ROLES.ADMIN,
        USER_ROLES.MEMBER,
        USER_ROLES.VIEWER
    ),

    getTask
);


/*
 * UPDATE TASK
 *
 * Owner + Admin + Member
 */
router.patch(
    "/:taskId",
    protect,

    validate(
        updateTaskSchema
    ),

    loadWorkspaceMember,

    authorizeRoles(
        USER_ROLES.OWNER,
        USER_ROLES.ADMIN,
        USER_ROLES.MEMBER
    ),

    updateTask
);


/*
 * DELETE TASK
 *
 * Owner + Admin
 */
router.delete(
    "/:taskId",
    protect,

    validate(
        taskIdSchema
    ),

    loadWorkspaceMember,

    authorizeRoles(
        USER_ROLES.OWNER,
        USER_ROLES.ADMIN
    ),

    deleteTask
);


module.exports = router;

