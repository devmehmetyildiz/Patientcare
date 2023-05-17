const routes = [
  { method: 'get', path: '/Home/CheckViews', controller: 'home', action: 'CheckViews' },

  { method: 'post', path: '/oauth/Login', controller: 'oauth', action: 'Login' },
  { method: 'post', path: '/oauth/Register', controller: 'oauth', action: 'Register' },

  { method: 'get', path: '/User', controller: 'user', action: 'GetUsers' },
  { method: 'get', path: '/User/:userId', controller: 'user', action: 'GetUser' },
  { method: 'post', path: '/User', controller: 'user', action: 'AddUser' },
  { method: 'put', path: '/User', controller: 'user', action: 'UpdateUser' },
  { method: 'delete', path: '/User', controller: 'user', action: 'DeleteUser' },

  { method: 'get', path: '/Roles', controller: 'role', action: 'GetRoles' },
  { method: 'get', path: '/Roles/:roleId', controller: 'role', action: 'GetRole' },
  { method: 'post', path: '/Roles', controller: 'role', action: 'AddRole' },
  { method: 'put', path: '/Roles', controller: 'role', action: 'UpdateRole' },
  { method: 'delete', path: '/Roles', controller: 'role', action: 'DeleteRole' },
]

module.exports = routes