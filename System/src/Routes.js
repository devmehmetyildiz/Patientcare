const Routes = [
  { method: 'get', path: '/Users', controller: 'user', action: 'GetUsers' },
  { method: 'get', path: '/Users/:userId', controller: 'user', action: 'GetUser' },
  { method: 'post', path: '/Users', controller: 'user', action: 'AddUser' },
  { method: 'put', path: '/Users', controller: 'user', action: 'UpdateUser' },
  { method: 'delete', path: '/Users', controller: 'user', action: 'DeleteUser' },

  { method: 'get', path: '/Roles', controller: 'role', action: 'GetRoles' },
  { method: 'get', path: '/Roles/:roleId', controller: 'role', action: 'GetRole' },
  { method: 'post', path: '/Roles', controller: 'role', action: 'AddRole' },
  { method: 'put', path: '/Roles', controller: 'role', action: 'UpdateRole' },
  { method: 'delete', path: '/Roles', controller: 'role', action: 'DeleteRole' },
]

module.exports = Routes