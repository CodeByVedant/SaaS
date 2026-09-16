const express = require("express");

const router = express.Router({
    mergeParams: true
});

const protect =
    require("../middlewares/auth.middleware");

const validate =
    require("../middlewares/validate.middleware");

const {
    loadWorkspaceMember,
    ownerOrAdmin
} =
    require("../middlewares/workspace.middleware");

const {
    addMember,
    getMembers,
    getMember,
    updateMemberRole,
    removeMember
} =
    require("../controllers/member.controller");

const {
    addMemberSchema,
    workspaceMembersSchema,
    memberIdSchema,
    updateMemberRoleSchema
} =
    require("../validators/member.validator");


/*
|--------------------------------------------------------------------------
| Add Member
|--------------------------------------------------------------------------
|
| POST
| /api/v1/workspaces/:workspaceId/members
|
| OWNER + ADMIN
|
*/

router.post(
    "/",
    protect,
    validate(addMemberSchema),
    loadWorkspaceMember,
    ownerOrAdmin,
    addMember
);


/*
|--------------------------------------------------------------------------
| Get Members
|--------------------------------------------------------------------------
|
| GET
| /api/v1/workspaces/:workspaceId/members
|
| Any workspace member can view members.
|
*/

router.get(
    "/",
    protect,
    validate(workspaceMembersSchema),
    loadWorkspaceMember,
    getMembers
);


/*
|--------------------------------------------------------------------------
| Get Single Member
|--------------------------------------------------------------------------
|
| GET
| /api/v1/workspaces/:workspaceId/members/:memberId
|
*/

router.get(
    "/:memberId",
    protect,
    validate(memberIdSchema),
    loadWorkspaceMember,
    getMember
);


/*
|--------------------------------------------------------------------------
| Update Member Role
|--------------------------------------------------------------------------
|
| PATCH
| /api/v1/workspaces/:workspaceId/members/:memberId
|
| OWNER + ADMIN
|
*/

router.patch(
    "/:memberId",
    protect,
    validate(updateMemberRoleSchema),
    loadWorkspaceMember,
    ownerOrAdmin,
    updateMemberRole
);


/*
|--------------------------------------------------------------------------
| Remove Member
|--------------------------------------------------------------------------
|
| DELETE
| /api/v1/workspaces/:workspaceId/members/:memberId
|
| OWNER + ADMIN
|
*/

router.delete(
    "/:memberId",
    protect,
    validate(memberIdSchema),
    loadWorkspaceMember,
    ownerOrAdmin,
    removeMember
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
//     ownerOrAdmin
// } =
//     require("../middlewares/workspace.middleware");

// const {
//     addMember,
//     getMembers,
//     getMember,
//     updateMemberRole,
//     removeMember
// } =
//     require("../controllers/member.controller");

// const {
//     addMemberSchema,
//     memberIdSchema,
//     updateMemberRoleSchema,
//     workspaceMembersSchema
// } =
//     require("../validators/member.validator");

// /*
// |--------------------------------------------------------------------------
// | Add Member
// |--------------------------------------------------------------------------
// |
// | OWNER + ADMIN
// |
// */

// router.post(
//     "/",
//     protect,
//     validate(addMemberSchema),
//     loadWorkspaceMember,
//     ownerOrAdmin,
//     addMember
// );

// /*
// |--------------------------------------------------------------------------
// | Get Members
// |--------------------------------------------------------------------------
// |
// | Any workspace member can view members.
// |
// */

// router.get(
//     "/",
//     protect,
//     validate(workspaceMembersSchema),
//     loadWorkspaceMember,
//     getMembers
// );

// /*
// |--------------------------------------------------------------------------
// | Get Single Member
// |--------------------------------------------------------------------------
// */

// router.get(
//     "/:memberId",
//     protect,
//     validate(memberIdSchema),
//     loadWorkspaceMember,
//     getMember
// );

// /*
// |--------------------------------------------------------------------------
// | Change Member Role
// |--------------------------------------------------------------------------
// |
// | OWNER + ADMIN
// |
// */

// router.patch(
//     "/:memberId",
//     protect,
//     validate(updateMemberRoleSchema),
//     loadWorkspaceMember,
//     ownerOrAdmin,
//     updateMemberRole
// );

// /*
// |--------------------------------------------------------------------------
// | Remove Member
// |--------------------------------------------------------------------------
// |
// | OWNER + ADMIN
// |
// */

// router.delete(
//     "/:memberId",
//     protect,
//     validate(memberIdSchema),
//     loadWorkspaceMember,
//     ownerOrAdmin,
//     removeMember
// );

// module.exports = router;

