const Workspace =
    require("../models/Workspace");

const WorkspaceMember =
    require("../models/WorkspaceMember");

const User =
    require("../models/User");

const ApiError =
    require("../utils/ApiError");

const {
    USER_ROLES
} = require("../utils/constants");

/*
|--------------------------------------------------------------------------
| Create Workspace
|--------------------------------------------------------------------------
*/

const createWorkspace = async ({
    userId,
    name,
    slug,
    description
}) => {

    // Make sure user exists.
    const user =
        await User.findById(userId);

    if (!user || !user.isActive) {
        throw new ApiError(
            401,
            "User account is not active"
        );
    }

    // Prevent duplicate slug for this owner.
    const existingWorkspace =
        await Workspace.findOne({
            owner: userId,
            slug,
            isActive: true
        });

    if (existingWorkspace) {
        throw new ApiError(
            409,
            "You already have a workspace with this slug"
        );
    }

    // Create workspace.
    const workspace =
        await Workspace.create({
            name,
            slug,
            description,
            owner: userId
        });

    /*
    |--------------------------------------------------------------------------
    | Automatically create OWNER membership
    |--------------------------------------------------------------------------
    */

    await WorkspaceMember.create({
        workspace: workspace._id,
        user: userId,
        role: USER_ROLES.OWNER
    });

    return Workspace.findById(
        workspace._id
    ).populate(
        "owner",
        "name email avatar"
    );
};

/*
|--------------------------------------------------------------------------
| Get My Workspaces
|--------------------------------------------------------------------------
*/

const getMyWorkspaces = async ({
    userId
}) => {

    const memberships =
        await WorkspaceMember.find({
            user: userId
        })
            .populate({
                path: "workspace",
                match: {
                    isActive: true,
                    deletedAt: null
                },
                populate: {
                    path: "owner",
                    select: "name email avatar"
                }
            })
            .sort({
                createdAt: -1
            });

    return memberships
        .filter(
            (membership) =>
                membership.workspace
        )
        .map((membership) => ({
            workspace:
                membership.workspace,

            role:
                membership.role,

            joinedAt:
                membership.joinedAt
        }));
};

/*
|--------------------------------------------------------------------------
| Get Workspace By ID
|--------------------------------------------------------------------------
*/

const getWorkspaceById = async ({
    workspaceId
}) => {

    const workspace =
        await Workspace.findOne({
            _id: workspaceId,
            isActive: true,
            deletedAt: null
        }).populate(
            "owner",
            "name email avatar"
        );

    if (!workspace) {
        throw new ApiError(
            404,
            "Workspace not found"
        );
    }

    return workspace;
};

/*
|--------------------------------------------------------------------------
| Update Workspace
|--------------------------------------------------------------------------
*/

const updateWorkspace = async ({
    workspaceId,
    data
}) => {

    const workspace =
        await Workspace.findOne({
            _id: workspaceId,
            isActive: true,
            deletedAt: null
        });

    if (!workspace) {
        throw new ApiError(
            404,
            "Workspace not found"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Update only allowed fields
    |--------------------------------------------------------------------------
    */

    if (data.name !== undefined) {
        workspace.name =
            data.name;
    }

    if (data.description !== undefined) {
        workspace.description =
            data.description;
    }

    if (data.slug !== undefined) {

        const existingWorkspace =
            await Workspace.findOne({
                owner: workspace.owner,
                slug: data.slug,
                _id: {
                    $ne: workspaceId
                },
                isActive: true
            });

        if (existingWorkspace) {
            throw new ApiError(
                409,
                "Workspace slug already exists"
            );
        }

        workspace.slug =
            data.slug;
    }

    await workspace.save();

    return Workspace.findById(
        workspace._id
    ).populate(
        "owner",
        "name email avatar"
    );
};

/*
|--------------------------------------------------------------------------
| Soft Delete Workspace
|--------------------------------------------------------------------------
*/

const deleteWorkspace = async ({
    workspaceId
}) => {

    const workspace =
        await Workspace.findOne({
            _id: workspaceId,
            isActive: true,
            deletedAt: null
        });

    if (!workspace) {
        throw new ApiError(
            404,
            "Workspace not found"
        );
    }

    workspace.isActive = false;
    workspace.deletedAt = new Date();

    await workspace.save();

    return {
        id: workspace._id,
        deletedAt: workspace.deletedAt
    };
};

module.exports = {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    deleteWorkspace
};

