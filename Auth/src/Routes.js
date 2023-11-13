const Routes = [

  { method: 'post', path: '/Oauth/Login', controller: 'Oauth', action: 'Login' },
  { method: 'post', path: '/Oauth/Register', controller: 'Oauth', action: 'Register' },
  { method: 'post', path: '/Oauth/ValidateToken', controller: 'Oauth', action: 'ValidateToken' },
  { method: 'get', path: '/Oauth/Testserver', controller: 'Oauth', action: 'Testserver' },

  { method: 'get', path: '/Password/Getrequestbyuser/:requestId', controller: 'Password', action: 'Getrequestbyuser' },
  { method: 'get', path: '/Password/Validateresetrequest/:requestId', controller: 'Password', action: 'Validateresetrequest' },
  { method: 'get', path: '/Password/Createrequest/:email', controller: 'Password', action: 'Createrequest' },
  { method: 'post', path: '/Password/Resetpassword', controller: 'Password', action: 'Resetpassword' },

]

module.exports = Routes