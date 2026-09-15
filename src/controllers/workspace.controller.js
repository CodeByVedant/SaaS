const asyncHandler =
    require("../utils/asyncHandler");

const workspaceService =
    require("../services/workspace.service");

/*
|--------------------------------------------------------------------------
| Create Workspace
|--------------------------------------------------------------------------
*/

const createWorkspace =
    asyncHandler(
        async (req, res) => {

            const workspace =
                await workspaceService
                    .createWorkspace({
                        userId:
                            req.user.id,

                        name:
                            req.body.name,

                        slug:
                            req.body.slug,

                        description:
                            req.body.description
                    });

            res.status(201).json({
                success: true,
                message:
                    "Workspace created successfully",
                data: {
                    workspace
                }
            });
        }
    );

/*
|--------------------------------------------------------------------------
| Get My Workspaces
|--------------------------------------------------------------------------
*/

const getMyWorkspaces =
    asyncHandler(
        async (req, res) => {

            const workspaces =
                await workspaceService
                    .getMyWorkspaces({
                        userId:
                            req.user.id
                    });

            res.status(200).json({
                success: true,
                data: {
                    workspaces
                }
            });
        }
    );

/*
|--------------------------------------------------------------------------
| Get Workspace
|--------------------------------------------------------------------------
*/

const getWorkspace =
    asyncHandler(
        async (req, res) => {

            const workspace =
                await workspaceService
                    .getWorkspaceById({
                        workspaceId:
                            req.params.workspaceId
                    });

            res.status(200).json({
                success: true,
                data: {
                    workspace,
                    role:
                        req.workspaceMember.role
                }
            });
        }
    );

/*
|--------------------------------------------------------------------------
| Update Workspace
|--------------------------------------------------------------------------
*/

const updateWorkspace =
    asyncHandler(
        async (req, res) => {

            const workspace =
                await workspaceService
                    .updateWorkspace({
                        workspaceId:
                            req.params.workspaceId,

                        data:
                            req.body
                    });

            res.status(200).json({
                success: true,
                message:
                    "Workspace updated successfully",
                data: {
                    workspace
                }
            });
        }
    );

/*
|--------------------------------------------------------------------------
| Delete Workspace
|--------------------------------------------------------------------------
*/

const deleteWorkspace =
    asyncHandler(
        async (req, res) => {

            const result =
                await workspaceService
                    .deleteWorkspace({
                        workspaceId:
                            req.params.workspaceId
                    });

            res.status(200).json({
                success: true,
                message:
                    "Workspace deleted successfully",
                data: result
            });
        }
    );

module.exports = {
    createWorkspace,
    getMyWorkspaces,
    getWorkspace,
    updateWorkspace,
    deleteWorkspace
};

