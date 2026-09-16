
const asyncHandler =
    require("../utils/asyncHandler");

const memberService =
    require("../services/member.service");

/*
|--------------------------------------------------------------------------
| Add Member
|--------------------------------------------------------------------------
*/

const addMember =
    asyncHandler(
        async (req, res) => {

            const member =
                await memberService.addMember({
                    workspaceId:
                        req.params.workspaceId,

                    email:
                        req.body.email,

                    role:
                        req.body.role,

                    actorMember:
                        req.workspaceMember
                });

            res.status(201).json({
                success: true,
                message:
                    "Member added successfully",
                data: {
                    member
                }
            });
        }
    );

/*
|--------------------------------------------------------------------------
| Get Members
|--------------------------------------------------------------------------
*/

const getMembers =
    asyncHandler(
        async (req, res) => {

            const members =
                await memberService.getMembers({
                    workspaceId:
                        req.params.workspaceId
                });

            res.status(200).json({
                success: true,
                data: {
                    members
                }
            });
        }
    );

/*
|--------------------------------------------------------------------------
| Get Single Member
|--------------------------------------------------------------------------
*/

const getMember =
    asyncHandler(
        async (req, res) => {

            const member =
                await memberService.getMemberById({
                    workspaceId:
                        req.params.workspaceId,

                    memberId:
                        req.params.memberId
                });

            res.status(200).json({
                success: true,
                data: {
                    member
                }
            });
        }
    );

/*
|--------------------------------------------------------------------------
| Update Member Role
|--------------------------------------------------------------------------
*/

const updateMemberRole =
    asyncHandler(
        async (req, res) => {

            const member =
                await memberService
                    .updateMemberRole({
                        workspaceId:
                            req.params.workspaceId,

                        memberId:
                            req.params.memberId,

                        newRole:
                            req.body.role,

                        actorMember:
                            req.workspaceMember
                    });

            res.status(200).json({
                success: true,
                message:
                    "Member role updated successfully",
                data: {
                    member
                }
            });
        }
    );

/*
|--------------------------------------------------------------------------
| Remove Member
|--------------------------------------------------------------------------
*/

const removeMember =
    asyncHandler(
        async (req, res) => {

            const result =
                await memberService
                    .removeMember({
                        workspaceId:
                            req.params.workspaceId,

                        memberId:
                            req.params.memberId,

                        actorMember:
                            req.workspaceMember
                    });

            res.status(200).json({
                success: true,
                message:
                    "Member removed successfully",
                data: result
            });
        }
    );

module.exports = {
    addMember,
    getMembers,
    getMember,
    updateMemberRole,
    removeMember
};

