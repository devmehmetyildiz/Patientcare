const Routes = [
  { method: 'get', path: '/Users', controller: 'User', action: 'GetUsers' },
  { method: 'get', path: '/Users/GetActiveUsername', controller: 'User', action: 'GetActiveUsername' },
  { method: 'get', path: '/Users/GetActiveUserMeta', controller: 'User', action: 'GetActiveUserMeta' },
  { method: 'get', path: '/Users/GetTableMeta', controller: 'User', action: 'Getusertablemetaconfig' },
  { method: 'post', path: '/Users/SaveTableMeta', controller: 'User', action: 'Saveusertablemetaconfig' },
  { method: 'get', path: '/Users/:userId', controller: 'User', action: 'GetUser' },
  { method: 'get', path: '/Users/Getbyusername/:username', controller: 'User', action: 'Getbyusername' },
  { method: 'get', path: '/Users/Getbyemail/:email', controller: 'User', action: 'Getbyemail' },
  { method: 'get', path: '/Users/Getusersalt/:userId', controller: 'User', action: 'Getusersalt' },
  { method: 'post', path: '/Users', controller: 'User', action: 'AddUser' },
  { method: 'post', path: '/Users/Register', controller: 'User', action: 'Register' },
  { method: 'put', path: '/Users', controller: 'User', action: 'UpdateUser' },
  { method: 'delete', path: '/Users/:userId', controller: 'User', action: 'DeleteUser' },

  { method: 'get', path: '/Roles', controller: 'Role', action: 'GetRoles' },
  { method: 'get', path: '/Roles/GetActiveuserprivileges', controller: 'Role', action: 'GetActiveuserprivileges' },
  { method: 'get', path: '/Roles/Getprivileges', controller: 'Role', action: 'Getprivileges' },
  { method: 'get', path: '/Roles/Getprivilegegroups', controller: 'Role', action: 'Getprivilegegroups' },
  { method: 'get', path: '/Roles/:roleId', controller: 'Role', action: 'GetRole' },
  { method: 'get', path: '/Roles/Getprivilegesbyuserid/:userId', controller: 'Role', action: 'Getprivilegesbyuserid' },
  { method: 'post', path: '/Roles', controller: 'Role', action: 'AddRole' },
  { method: 'put', path: '/Roles', controller: 'Role', action: 'UpdateRole' },
  { method: 'delete', path: '/Roles/:roleId', controller: 'Role', action: 'DeleteRole' },
]

module.exports = Routes