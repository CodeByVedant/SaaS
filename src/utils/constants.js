
const USER_ROLES = {
    OWNER: "owner",
    ADMIN: "admin",
    MEMBER: "member",
    VIEWER: "viewer"
};

const TASK_STATUS = {
    BACKLOG: "backlog",
    IN_PROGRESS: "in_progress",
    CODE_REVIEW: "code_review",
    DONE: "done"
};

const TASK_PRIORITY = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    URGENT: "urgent"
};

const ACTIVITY_TYPES = {
    CREATED: "created",
    UPDATED: "updated",
    DELETED: "deleted",
    STATUS_CHANGED: "status_changed",
    ASSIGNED: "assigned",
    COMMENT_ADDED: "comment_added",
    ATTACHMENT_ADDED: "attachment_added"
};

/*
|--------------------------------------------------------------------------
| Role Hierarchy
|--------------------------------------------------------------------------
|
| Higher number = higher privilege.
|
*/

const ROLE_LEVELS = {
    [USER_ROLES.VIEWER]: 1,
    [USER_ROLES.MEMBER]: 2,
    [USER_ROLES.ADMIN]: 3,
    [USER_ROLES.OWNER]: 4
};

module.exports = {
    USER_ROLES,
    TASK_STATUS,
    TASK_PRIORITY,
    ACTIVITY_TYPES,
    ROLE_LEVELS
};










/*const USER_ROLES = {
    OWNER: "owner",
    ADMIN: "admin",
    MEMBER: "member",
    VIEWER: "viewer"
};

const TASK_STATUS = {
    BACKLOG: "backlog",
    IN_PROGRESS: "in_progress",
    CODE_REVIEW: "code_review",
    DONE: "done"
};

const TASK_PRIORITY = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    URGENT: "urgent"
};

const ACTIVITY_TYPES = {
    CREATED: "created",
    UPDATED: "updated",
    DELETED: "deleted",
    STATUS_CHANGED: "status_changed",
    ASSIGNED: "assigned",
    COMMENT_ADDED: "comment_added",
    ATTACHMENT_ADDED: "attachment_added"
};

module.exports = {
    USER_ROLES,
    TASK_STATUS,
    TASK_PRIORITY,
    ACTIVITY_TYPES
}; */