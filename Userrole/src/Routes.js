const Routes = [
  { method: 'get', path: '/Users', controller: 'user', action: 'GetUsers' },
  { method: 'get', path: '/Users/GetActiveUsername', controller: 'user', action: 'GetActiveUsername' },
  { method: 'get', path: '/Users/GetActiveUserMeta', controller: 'user', action: 'GetActiveUserMeta' },
  { method: 'get', path: '/Users/GetTableMeta', controller: 'user', action: 'Getusertablemetaconfig' },
  { method: 'post', path: '/Users/SaveTableMeta', controller: 'user', action: 'Saveusertablemetaconfig' },
  { method: 'get', path: '/Users/:userId', controller: 'user', action: 'GetUser' },
  { method: 'get', path: '/Users/Getbyusername/:username', controller: 'user', action: 'Getbyusername' },
  { method: 'get', path: '/Users/Getusersalt/:userId', controller: 'user', action: 'Getusersalt' },
  { method: 'post', path: '/Users', controller: 'user', action: 'AddUser' },
  { method: 'post', path: '/Users/Register', controller: 'user', action: 'Register' },
  { method: 'put', path: '/Users', controller: 'user', action: 'UpdateUser' },
  { method: 'delete', path: '/Users', controller: 'user', action: 'DeleteUser' },

  { method: 'get', path: '/Roles', controller: 'Role', action: 'GetRoles', exact: true },
  { method: 'get', path: '/Roles/GetActiveuserprivileges', controller: 'Role', action: 'GetActiveuserprivileges' },
  { method: 'get', path: '/Roles/Getprivileges', controller: 'Role', action: 'Getprivileges' },
  { method: 'get', path: '/Roles/Getprivilegegroups', controller: 'Role', action: 'Getprivilegegroups' },
  { method: 'get', path: '/Roles/:roleId', controller: 'Role', action: 'GetRole' },
  { method: 'get', path: '/Roles/Getprivilegesbyuserid/:userId', controller: 'Role', action: 'Getprivilegesbyuserid' },
  { method: 'post', path: '/Roles', controller: 'Role', action: 'AddRole' },
  { method: 'put', path: '/Roles', controller: 'Role', action: 'UpdateRole' },
  { method: 'delete', path: '/Roles', controller: 'Role', action: 'DeleteRole' },
]

module.exports = Routes