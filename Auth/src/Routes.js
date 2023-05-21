const Routes = [

  { method: 'post', path: '/oauth/Login', controller: 'Oauth', action: 'Login' },
  { method: 'post', path: '/oauth/ValidateToken', controller: 'Oauth', action: 'ValidateToken' },
  { method: 'get', path: '/oauth/Testserver', controller: 'Oauth', action: 'Testserver' },

]

module.exports = Routes