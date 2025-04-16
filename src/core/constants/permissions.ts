export enum Permission {
  // Product permissions
  VIEW_PRODUCTS = 'view:products',
  CREATE_PRODUCT = 'create:product',
  UPDATE_PRODUCT = 'update:product',
  DELETE_PRODUCT = 'delete:product',
  
  // Category permissions
  VIEW_CATEGORIES = 'view:categories',
  CREATE_CATEGORY = 'create:category',
  UPDATE_CATEGORY = 'update:category',
  DELETE_CATEGORY = 'delete:category',
  
  // Order permissions
  VIEW_ORDERS = 'view:orders',
  CREATE_ORDER = 'create:order',
  UPDATE_ORDER = 'update:order',
  DELETE_ORDER = 'delete:order',
  
  // User permissions
  VIEW_USERS = 'view:users',
  CREATE_USER = 'create:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',
  
  // Admin permissions
  MANAGE_ROLES = 'manage:roles',
  MANAGE_PERMISSIONS = 'manage:permissions',
}

export const RolePermissions = {
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