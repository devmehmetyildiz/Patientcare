const Routes = [
    { method: 'get', path: '/Logs', controller: 'Log', action: 'GetLogs' },
    { method: 'post', path: '/Logs/Getbyquerry', controller: 'Log', action: 'GetLogswithquerry' },
    { method: 'post', path: '/Logs', controller: 'Log', action: 'AddLog' },
]

module.exports = Routes