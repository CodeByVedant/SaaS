const WorkspaceMember = require("../models/WorkspaceMember");
const ApiError = require("../utils/ApiError");

const loadWorkspaceMember = async (
    req,
    res,
    next
) => {

    const { workspaceId } = req.params;

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

    req.workspaceMember = membership;

    next();
};

const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {

        if (
            !req.workspaceMember ||
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

module.exports = {
    loadWorkspaceMember,
    authorizeRoles
};