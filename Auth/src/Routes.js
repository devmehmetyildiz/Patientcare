const Routes = [

  { method: 'post', path: '/Oauth/Login', controller: 'Oauth', action: 'Login' },
  { method: 'post', path: '/Oauth/ValidateToken', controller: 'Oauth', action: 'ValidateToken' },
  { method: 'get', path: '/Oauth/Testserver', controller: 'Oauth', action: 'Testserver' },
  
  { method: 'get', path: '/Password/Validateresetrequest/:requestId', controller: 'Password', action: 'Validateresetrequest' },
  { method: 'get', path: '/Password/Createrequest/:email', controller: 'Password', action: 'Createrequest' },
  { method: 'post', path: '/Password/Changepassword', controller: 'Password', action: 'Changepassword' },
 
]

module.exports = Routes