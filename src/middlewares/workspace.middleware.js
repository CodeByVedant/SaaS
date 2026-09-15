const WorkspaceMember =
    require("../models/WorkspaceMember");

const ApiError =
    require("../utils/ApiError");

const {
    USER_ROLES
} = require("../utils/constants");

/*
|--------------------------------------------------------------------------
| Load Workspace Membership
|--------------------------------------------------------------------------
|
| This middleware verifies that the authenticated user actually belongs
| to the workspace requested in the URL.
|
*/

const loadWorkspaceMember = async (
    req,
    res,
    next
) => {

    try {

        const {
            workspaceId
        } = req.params;

        if (!workspaceId) {
            return next(
                new ApiError(
                    400,
                    "Workspace ID is required"
                )
            );
        }

        const membership =
            await WorkspaceMember.findOne({
                workspace: workspaceId,
                user: req.user.id
            });

        if (!membership) {
            return next(
                new ApiError(
                    403,
                    "You are not a member of this workspace"
                )
            );
        }

        req.workspaceMember =
            membership;

        next();

    } catch (error) {
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| Role Authorization
|--------------------------------------------------------------------------
*/

const authorizeRoles = (
    ...allowedRoles
) => {

    return (
        req,
        res,
        next
    ) => {

        if (!req.workspaceMember) {
            return next(
                new ApiError(
                    403,
                    "Workspace membership not verified"
                )
            );
        }

        if (
            !allowedRoles.includes(
                req.workspaceMember.role
            )
        ) {
            return next(
                new ApiError(
                    403,
                    "You do not have permission to perform this action"
                )
            );
        }

        next();
    };
};

/*
|--------------------------------------------------------------------------
| Common Role Helpers
|--------------------------------------------------------------------------
*/

const ownerOnly =
    authorizeRoles(
        USER_ROLES.OWNER
    );

const ownerOrAdmin =
    authorizeRoles(
        USER_ROLES.OWNER,
        USER_ROLES.ADMIN
    );

const ownerAdminMember =
    authorizeRoles(
        USER_ROLES.OWNER,
        USER_ROLES.ADMIN,
        USER_ROLES.MEMBER
    );

module.exports = {
    loadWorkspaceMember,
    authorizeRoles,
    ownerOnly,
    ownerOrAdmin,
    ownerAdminMember
};

