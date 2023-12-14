const Routes = [
  { method: 'get', path: '/Users/GetCount', controller: 'User', action: 'GetUserscount' },
  { method: 'get', path: '/Users', controller: 'User', action: 'GetUsers' },
  { method: 'get', path: '/Users/GetActiveUsername', controller: 'User', action: 'GetActiveUsername' },
  { method: 'get', path: '/Users/GetActiveUserMeta', controller: 'User', action: 'GetActiveUserMeta' },
  { method: 'get', path: '/Users/GetTableMeta', controller: 'User', action: 'Getusertablemetaconfig' },
  { method: 'get', path: '/Users/:userId', controller: 'User', action: 'GetUser' },
  { method: 'get', path: '/Users/Getbyusername/:username', controller: 'User', action: 'Getbyusername' },
  { method: 'get', path: '/Users/Getbyemail/:email', controller: 'User', action: 'Getbyemail' },
  { method: 'get', path: '/Users/Getusersalt/:userId', controller: 'User', action: 'Getusersalt' },
  { method: 'post', path: '/Users/Changepassword', controller: 'User', action: 'Changepassword' },
  { method: 'post', path: '/Users/SaveTableMeta', controller: 'User', action: 'Saveusertablemetaconfig' },
  { method: 'post', path: '/Users', controller: 'User', action: 'AddUser' },
  { method: 'post', path: '/Users/Register', controller: 'User', action: 'Register' },
  { method: 'put', path: '/Users/UpdateUsermeta', controller: 'User', action: 'UpdateUsermeta' },
  { method: 'put', path: '/Users', controller: 'User', action: 'UpdateUser' },
  { method: 'delete', path: '/Users/Resettablemeta/:metaKey', controller: 'User', action: 'Resettablemeta' },
  { method: 'delete', path: '/Users/:userId', controller: 'User', action: 'DeleteUser' },

  { method: 'get', path: '/Roles/GetCount', controller: 'Role', action: 'GetRolescount' },
  { method: 'get', path: '/Roles', controller: 'Role', action: 'GetRoles' },
  { method: 'get', path: '/Roles/GetActiveuserprivileges', controller: 'Role', action: 'GetActiveuserprivileges' },
  { method: 'get', path: '/Roles/Getprivileges', controller: 'Role', action: 'Getprivileges' },
  { method: 'get', path: '/Roles/Getprivilegegroups', controller: 'Role', action: 'Getprivilegegroups' },
  { method: 'get', path: '/Roles/:roleId', controller: 'Role', action: 'GetRole' },
  { method: 'get', path: '/Roles/Getprivilegesbyuserid/:userId', controller: 'Role', action: 'Getprivilegesbyuserid' },
  { method: 'post', path: '/Roles', controller: 'Role', action: 'AddRole' },
  { method: 'put', path: '/Roles', controller: 'Role', action: 'UpdateRole' },
  { method: 'delete', path: '/Roles/:roleId', controller: 'Role', action: 'DeleteRole' },

  { method: 'get', path: '/Usernotifications/GetUsernotificationsbyUserid/:userId', controller: 'Usernotification', action: 'GetUsernotificationsbyUserid' },
  { method: 'get', path: '/Usernotifications/:notificationId', controller: 'Usernotification', action: 'GetUsernotification' },
  { method: 'get', path: '/Usernotifications', controller: 'Usernotification', action: 'GetUsernotifications' },
  { method: 'post', path: '/Usernotifications', controller: 'Usernotification', action: 'AddUsernotification' },
  { method: 'put', path: '/Usernotifications/Editrecord', controller: 'Usernotification', action: 'UpdateUsernotifications' },
  { method: 'put', path: '/Usernotifications', controller: 'Usernotification', action: 'UpdateUsernotification' },
  { method: 'delete', path: '/Usernotifications/DeleteUsernotificationbyidreaded/:userId', controller: 'Usernotification', action: 'DeleteUsernotificationbyidreaded' },
  { method: 'delete', path: '/Usernotifications/DeleteUsernotificationbyid/:userId', controller: 'Usernotification', action: 'DeleteUsernotificationbyid' },
  { method: 'delete', path: '/Usernotifications/:notificationId', controller: 'Usernotification', action: 'DeleteUsernotification' },
]

module.exports = Routes