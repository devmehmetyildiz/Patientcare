const Routes = [
    { method: 'get', path: '/Logs', controller: 'Log', action: 'GetLogs' },
    { method: 'post', path: '/Logs/GetByQuerry', controller: 'Log', action: 'GetLogsByQuerry' },
    { method: 'post', path: '/Logs', controller: 'Log', action: 'AddLog' },
]

module.exports = Routes