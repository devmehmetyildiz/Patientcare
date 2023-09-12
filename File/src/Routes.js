const Routes = [
  { method: 'get', path: '/Files/GetbyparentID/:parentId', controller: 'File', action: 'GetbyparentID' },
  { method: 'get', path: '/Files/GetbyorderfileID/:parentId', controller: 'File', action: 'GetbyparentID' },
  { method: 'get', path: '/Files/Downloadfile/:fileId', controller: 'File', action: 'Downloadfile' },
  { method: 'get', path: '/Files/:fileId', controller: 'File', action: 'GetFile' },
  { method: 'get', path: '/Files', controller: 'File', action: 'GetFiles' },
  { method: 'post', path: '/Files', controller: 'File', action: 'AddFile' },
  { method: 'put', path: '/Files', controller: 'File', action: 'UpdateFile' },
  { method: 'delete', path: '/Files/:fileId', controller: 'File', action: 'DeleteFile' },

]

module.exports = Routes