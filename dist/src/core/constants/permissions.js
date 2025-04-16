"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissions = exports.Permission = void 0;
var Permission;
(function (Permission) {
    // Product permissions
    Permission["VIEW_PRODUCTS"] = "view:products";
    Permission["CREATE_PRODUCT"] = "create:product";
    Permission["UPDATE_PRODUCT"] = "update:product";
    Permission["DELETE_PRODUCT"] = "delete:product";
    // Category permissions
    Permission["VIEW_CATEGORIES"] = "view:categories";
    Permission["CREATE_CATEGORY"] = "create:category";
    Permission["UPDATE_CATEGORY"] = "update:category";
    Permission["DELETE_CATEGORY"] = "delete:category";
    // Order permissions
    Permission["VIEW_ORDERS"] = "view:orders";
    Permission["CREATE_ORDER"] = "create:order";
    Permission["UPDATE_ORDER"] = "update:order";
    Permission["DELETE_ORDER"] = "delete:order";
    // User permissions
    Permission["VIEW_USERS"] = "view:users";
    Permission["CREATE_USER"] = "create:user";
    Permission["UPDATE_USER"] = "update:user";
    Permission["DELETE_USER"] = "delete:user";
    // Admin permissions
    Permission["MANAGE_ROLES"] = "manage:roles";
    Permission["MANAGE_PERMISSIONS"] = "manage:permissions";
})(Permission || (exports.Permission = Permission = {}));
exports.RolePermissions = {
    ADMIN: Object.values(Permission),
    VENDOR: [
        Permission.VIEW_PRODUCTS,
        Permission.CREATE_PRODUCT,
        Permission.UPDATE_PRODUCT,
        Permission.DELETE_PRODUCT,
        Permission.VIEW_CATEGORIES,
        Permission.CREATE_CATEGORY,
        Permission.UPDATE_CATEGORY,
        Permission.DELETE_CATEGORY,
        Permission.VIEW_ORDERS,
        Permission.UPDATE_ORDER,
    ],
    CUSTOMER: [
        Permission.VIEW_PRODUCTS,
        Permission.VIEW_CATEGORIES,
        Permission.CREATE_ORDER,
        Permission.VIEW_ORDERS,
    ],
};
//# sourceMappingURL=permissions.js.map