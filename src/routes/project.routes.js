const express =
    require("express");

const router =
    express.Router();


const protect =
    require("../middlewares/auth.middleware");


const validate =
    require("../middlewares/validate.middleware");


const {
    loadWorkspaceMember,
    authorizeRoles,
    ownerOnly
} = require("../middlewares/workspace.middleware");


const {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject
} = require("../controllers/project.controller");


const {
    createProjectSchema,
    listProjectsSchema,
    projectIdSchema,
    updateProjectSchema
} = require("../validators/project.validator");


const {
    USER_ROLES
} = require("../utils/constants");


/*
 * =========================================================
 * CREATE PROJECT
 * =========================================================
 *
 * OWNER + ADMIN ONLY
 *
 * Member -> DENIED
 * Viewer -> DENIED
 */
router.post(
    "/",

    protect,

    validate(
        createProjectSchema
    ),

    loadWorkspaceMember,

    authorizeRoles(
        USER_ROLES.OWNER,
        USER_ROLES.ADMIN
    ),

    createProject
);


/*
 * =========================================================
 * GET PROJECTS
 * =========================================================
 *
 * ALL ROLES
 */
router.get(
    "/",

    protect,

    validate(
        listProjectsSchema
    ),

    loadWorkspaceMember,

    authorizeRoles(
        USER_ROLES.OWNER,
        USER_ROLES.ADMIN,
        USER_ROLES.MEMBER,
        USER_ROLES.VIEWER
    ),

    getProjects
);


/*
 * =========================================================
 * GET SINGLE PROJECT
 * =========================================================
 *
 * ALL ROLES
 */
router.get(
    "/:projectId",

    protect,

    validate(
        projectIdSchema
    ),

    loadWorkspaceMember,

    authorizeRoles(
        USER_ROLES.OWNER,
        USER_ROLES.ADMIN,
        USER_ROLES.MEMBER,
        USER_ROLES.VIEWER
    ),

    getProject
);


/*
 * =========================================================
 * UPDATE PROJECT
 * =========================================================
 *
 * OWNER + ADMIN ONLY
 *
 * Member -> DENIED
 * Viewer -> DENIED
 */
router.patch(
    "/:projectId",

    protect,

    validate(
        updateProjectSchema
    ),

    loadWorkspaceMember,

    authorizeRoles(
        USER_ROLES.OWNER,
        USER_ROLES.ADMIN
    ),

    updateProject
);


/*
 * =========================================================
 * DELETE PROJECT
 * =========================================================
 *
 * OWNER ONLY
 */
router.delete(
    "/:projectId",

    protect,

    validate(
        projectIdSchema
    ),

    loadWorkspaceMember,

    ownerOnly,

    deleteProject
);


module.exports = router;




// const express = require("express");

// const router = express.Router();

// const protect =
//     require("../middlewares/auth.middleware");

// const validate =
//     require("../middlewares/validate.middleware");

// const {
//     loadWorkspaceMember,
//     authorizeRoles,
//     ownerOrAdmin,
//     ownerOnly
// } = require("../middlewares/workspace.middleware");

// const {
//     createProject,
//     getProjects,
//     getProject,
//     updateProject,
//     deleteProject
// } = require("../controllers/project.controller");

// const {
//     createProjectSchema,
//     listProjectsSchema,
//     projectIdSchema,
//     updateProjectSchema
// } = require("../validators/project.validator");

// const {
//     USER_ROLES
// } = require("../utils/constants");


// /*
//  * =========================================================
//  * CREATE PROJECT
//  * =========================================================
//  *
//  * Owner
//  * Admin
//  * Member
//  *
//  * Viewer -> DENIED
//  */
// router.post(
//     "/",
//     protect,
//     validate(createProjectSchema),
//     loadWorkspaceMember,
//     authorizeRoles(
//         USER_ROLES.OWNER,
//         USER_ROLES.ADMIN,
//         USER_ROLES.MEMBER
//     ),
//     createProject
// );


// /*
//  * =========================================================
//  * GET PROJECTS
//  * =========================================================
//  *
//  * All workspace members can view.
//  */
// router.get(
//     "/",
//     protect,
//     validate(listProjectsSchema),
//     loadWorkspaceMember,
//     authorizeRoles(
//         USER_ROLES.OWNER,
//         USER_ROLES.ADMIN,
//         USER_ROLES.MEMBER,
//         USER_ROLES.VIEWER
//     ),
//     getProjects
// );


// /*
//  * =========================================================
//  * GET SINGLE PROJECT
//  * =========================================================
//  */
// router.get(
//     "/:projectId",
//     protect,
//     validate(projectIdSchema),
//     loadWorkspaceMember,
//     authorizeRoles(
//         USER_ROLES.OWNER,
//         USER_ROLES.ADMIN,
//         USER_ROLES.MEMBER,
//         USER_ROLES.VIEWER
//     ),
//     getProject
// );


// /*
//  * =========================================================
//  * UPDATE PROJECT
//  * =========================================================
//  *
//  * Owner
//  * Admin
//  * Member
//  *
//  * Viewer -> DENIED
//  */
// router.patch(
//     "/:projectId",
//     protect,
//     validate(updateProjectSchema),
//     loadWorkspaceMember,
//     authorizeRoles(
//         USER_ROLES.OWNER,
//         USER_ROLES.ADMIN,
//         USER_ROLES.MEMBER
//     ),
//     updateProject
// );


// /*
//  * =========================================================
//  * DELETE PROJECT
//  * =========================================================
//  *
//  * Owner only.
//  */
// router.delete(
//     "/:projectId",
//     protect,
//     validate(projectIdSchema),
//     loadWorkspaceMember,
//     ownerOnly,
//     deleteProject
// );


// module.exports = router;
