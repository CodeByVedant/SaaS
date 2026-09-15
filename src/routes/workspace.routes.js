const express = require("express");

const router = express.Router();

const protect =
    require("../middlewares/auth.middleware");

const validate =
    require("../middlewares/validate.middleware");

const {
    loadWorkspaceMember,
    ownerOnly,
    ownerOrAdmin
} =
    require("../middlewares/workspace.middleware");

const {
    createWorkspace,
    getMyWorkspaces,
    getWorkspace,
    updateWorkspace,
    deleteWorkspace
} =
    require("../controllers/workspace.controller");

const {
    createWorkspaceSchema,
    workspaceIdSchema,
    updateWorkspaceSchema
} =
    require("../validators/workspace.validator");

/*
|--------------------------------------------------------------------------
| Create Workspace
|--------------------------------------------------------------------------
|
| POST /api/v1/workspaces
|
*/

router.post(
    "/",
    protect,
    validate(createWorkspaceSchema),
    createWorkspace
);

/*
|--------------------------------------------------------------------------
| Get My Workspaces
|--------------------------------------------------------------------------
|
| GET /api/v1/workspaces
|
*/

router.get(
    "/",
    protect,
    getMyWorkspaces
);

/*
|--------------------------------------------------------------------------
| Get Workspace
|--------------------------------------------------------------------------
|
| GET /api/v1/workspaces/:workspaceId
|
*/

router.get(
    "/:workspaceId",
    protect,
    validate(workspaceIdSchema),
    loadWorkspaceMember,
    getWorkspace
);

/*
|--------------------------------------------------------------------------
| Update Workspace
|--------------------------------------------------------------------------
|
| OWNER + ADMIN
|
*/

router.patch(
    "/:workspaceId",
    protect,
    validate(updateWorkspaceSchema),
    loadWorkspaceMember,
    ownerOrAdmin,
    updateWorkspace
);

/*
|--------------------------------------------------------------------------
| Delete Workspace
|--------------------------------------------------------------------------
|
| OWNER ONLY
|
*/

router.delete(
    "/:workspaceId",
    protect,
    validate(workspaceIdSchema),
    loadWorkspaceMember,
    ownerOnly,
    deleteWorkspace
);

module.exports = router;
