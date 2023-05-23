const Routes = [
    { method: 'get', path: '/Cases', controller: 'Case', action: 'GetCases' },
    { method: 'get', path: '/Cases/:caseId', controller: 'Case', action: 'GetCase' },
    { method: 'post', path: '/Cases', controller: 'Case', action: 'AddCase' },
    { method: 'put', path: '/Cases', controller: 'Case', action: 'UpdateCase' },
    { method: 'delete', path: '/Cases', controller: 'Case', action: 'DeleteCase' },

    
  ]
  
  module.exports = Routes