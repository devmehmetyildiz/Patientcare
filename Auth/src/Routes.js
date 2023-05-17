const Routes = [

  { method: 'post', path: '/oauth/Login', controller: 'oauth', action: 'Login' },
  { method: 'post', path: '/oauth/ValidateToken', controller: 'oauth', action: 'ValidateToken' },

]

module.exports = Routes