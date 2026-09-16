
const User =
    require("../models/User");

const Workspace =
    require("../models/Workspace");

const WorkspaceMember =
    require("../models/WorkspaceMember");

const ApiError =
    require("../utils/ApiError");

const {
    USER_ROLES,
    ROLE_LEVELS
} = require("../utils/constants");

/*
|--------------------------------------------------------------------------
| Verify Workspace
|--------------------------------------------------------------------------
*/

const ensureWorkspaceExists = async (
    workspaceId
) => {

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

    return workspace;
};

/*
|--------------------------------------------------------------------------
| Add Member
|--------------------------------------------------------------------------
*/

const addMember = async ({
    workspaceId,
    email,
    role,
    actorMember
}) => {

    await ensureWorkspaceExists(
        workspaceId
    );

    /*
    |--------------------------------------------------------------------------
    | Find User
    |--------------------------------------------------------------------------
    */

    const user =
        await User.findOne({
            email,
            isActive: true
        });

    if (!user) {
        throw new ApiError(
            404,
            "User with this email does not exist"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Prevent adding yourself
    |--------------------------------------------------------------------------
    */

    if (
        user._id.toString() ===
        actorMember.user.toString()
    ) {
        throw new ApiError(
            400,
            "You are already a member of this workspace"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Prevent duplicate membership
    |--------------------------------------------------------------------------
    */

    const existingMember =
        await WorkspaceMember.findOne({
            workspace: workspaceId,
            user: user._id
        });

    if (existingMember) {
        throw new ApiError(
            409,
            "User is already a member of this workspace"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Admin restrictions
    |--------------------------------------------------------------------------
    |
    | Admin cannot create another admin.
    |
    */

    if (
        actorMember.role === USER_ROLES.ADMIN &&
        role === USER_ROLES.ADMIN
    ) {
        throw new ApiError(
            403,
            "Admins cannot create another admin"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Create Membership
    |--------------------------------------------------------------------------
    */

    const membership =
        await WorkspaceMember.create({
            workspace: workspaceId,
            user: user._id,
            role
        });

    return WorkspaceMember.findById(
        membership._id
    ).populate(
        "user",
        "name email avatar isActive"
    );
};

/*
|--------------------------------------------------------------------------
| Get Members
|--------------------------------------------------------------------------
*/

const getMembers = async ({
    workspaceId
}) => {

    await ensureWorkspaceExists(
        workspaceId
    );

    return WorkspaceMember.find({
        workspace: workspaceId
    })
        .populate(
            "user",
            "name email avatar isActive lastLoginAt"
        )
        .sort({
            role: -1,
            createdAt: 1
        });
};

/*
|--------------------------------------------------------------------------
| Get Member
|--------------------------------------------------------------------------
*/

const getMemberById = async ({
    workspaceId,
    memberId
}) => {

    const member =
        await WorkspaceMember.findOne({
            _id: memberId,
            workspace: workspaceId
        }).populate(
            "user",
            "name email avatar isActive"
        );

    if (!member) {
        throw new ApiError(
            404,
            "Workspace member not found"
        );
    }

    return member;
};

/*
|--------------------------------------------------------------------------
| Update Member Role
|--------------------------------------------------------------------------
*/

const updateMemberRole = async ({
    workspaceId,
    memberId,
    newRole,
    actorMember
}) => {

    const targetMember =
        await WorkspaceMember.findOne({
            _id: memberId,
            workspace: workspaceId
        });

    if (!targetMember) {
        throw new ApiError(
            404,
            "Workspace member not found"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Cannot modify yourself
    |--------------------------------------------------------------------------
    */

    if (
        targetMember.user.toString() ===
        actorMember.user.toString()
    ) {
        throw new ApiError(
            400,
            "You cannot change your own workspace role"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Owner Protection
    |--------------------------------------------------------------------------
    */

    if (
        targetMember.role ===
        USER_ROLES.OWNER
    ) {
        throw new ApiError(
            403,
            "Workspace owner role cannot be changed"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Admin Restrictions
    |--------------------------------------------------------------------------
    */

    if (
        actorMember.role === USER_ROLES.ADMIN &&
        targetMember.role === USER_ROLES.ADMIN
    ) {
        throw new ApiError(
            403,
            "Admins cannot modify another admin"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Admin cannot promote to admin
    |--------------------------------------------------------------------------
    */

    if (
        actorMember.role === USER_ROLES.ADMIN &&
        newRole === USER_ROLES.ADMIN
    ) {
        throw new ApiError(
            403,
            "Only the workspace owner can create admins"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Update Role
    |--------------------------------------------------------------------------
    */

    targetMember.role =
        newRole;

    await targetMember.save();

    return WorkspaceMember.findById(
        targetMember._id
    ).populate(
        "user",
        "name email avatar isActive"
    );
};

/*
|--------------------------------------------------------------------------
| Remove Member
|--------------------------------------------------------------------------
*/

const removeMember = async ({
    workspaceId,
    memberId,
    actorMember
}) => {

    const targetMember =
        await WorkspaceMember.findOne({
            _id: memberId,
            workspace: workspaceId
        });

    if (!targetMember) {
        throw new ApiError(
            404,
            "Workspace member not found"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Cannot remove yourself
    |--------------------------------------------------------------------------
    */

    if (
        targetMember.user.toString() ===
        actorMember.user.toString()
    ) {
        throw new ApiError(
            400,
            "You cannot remove yourself from the workspace"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Owner Protection
    |--------------------------------------------------------------------------
    */

    if (
        targetMember.role ===
        USER_ROLES.OWNER
    ) {
        throw new ApiError(
            403,
            "Workspace owner cannot be removed"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Admin Restrictions
    |--------------------------------------------------------------------------
    */

    if (
        actorMember.role === USER_ROLES.ADMIN &&
        targetMember.role === USER_ROLES.ADMIN
    ) {
        throw new ApiError(
            403,
            "Admins cannot remove another admin"
        );
    }

    await WorkspaceMember.deleteOne({
        _id: targetMember._id
    });

    return {
        memberId: targetMember._id,
        userId: targetMember.user,
        removed: true
    };
};

module.exports = {
    addMember,
    getMembers,
    getMemberById,
    updateMemberRole,
    removeMember
};

