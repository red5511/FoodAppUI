/* tslint:disable */
/* eslint-disable */
export interface AddOrDeleteUsersPermissionsAdministrationRequest {
  permissionToAdd: Array<'VIEW_ONLINE_ORDERING' | 'VIEW_STATISTICS' | 'VIEW_ORDERS_HISTORY' | 'VIEW_RESTAURANT_ORDERING' | 'VIEW_MENU_PANEL' | 'ADMINISTRATOR' | 'SUPER_ADMINISTRATOR'>;
  permissionToRemove: Array<'VIEW_ONLINE_ORDERING' | 'VIEW_STATISTICS' | 'VIEW_ORDERS_HISTORY' | 'VIEW_RESTAURANT_ORDERING' | 'VIEW_MENU_PANEL' | 'ADMINISTRATOR' | 'SUPER_ADMINISTRATOR'>;
  userId: number;
}
