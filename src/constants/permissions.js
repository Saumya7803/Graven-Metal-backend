export const PERMISSIONS = {
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_CATEGORIES: 'manage_categories',
  MANAGE_BLOGS: 'manage_blogs',
  MANAGE_QUOTES: 'manage_quotes',
  MANAGE_CONTACTS: 'manage_contacts',
  MANAGE_USERS: 'manage_users',
  MANAGE_ADMINS: 'manage_admins',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_SEO: 'manage_seo',
  VIEW_ANALYTICS: 'view_analytics',
  BACKUP_DATABASE: 'backup_database',
};

export const ROLE_DEFAULT_PERMISSIONS = {
  super_admin: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.MANAGE_PRODUCTS,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MANAGE_BLOGS,
    PERMISSIONS.MANAGE_QUOTES,
    PERMISSIONS.MANAGE_CONTACTS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  editor: [
    PERMISSIONS.MANAGE_PRODUCTS,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MANAGE_BLOGS,
  ],
  user: [],
};
