const Routes = [

  { method: 'post', path: '/Oauth/Login', controller: 'Oauth', action: 'Login' },
  { method: 'post', path: '/Oauth/ValidateToken', controller: 'Oauth', action: 'ValidateToken' },
  { method: 'get', path: '/Oauth/Testserver', controller: 'Oauth', action: 'Testserver' },
 
]

module.exports = Routes