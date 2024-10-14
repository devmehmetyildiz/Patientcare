const Routes = [
    { method: 'get', path: '/Logs/GetServiceUsageCountDaily', controller: 'Log', action: 'GetServiceUsageCountDaily' },
    { method: 'get', path: '/Logs/GetServiceUsageCount', controller: 'Log', action: 'GetServiceUsageCount' },
    { method: 'get', path: '/Logs/GetUsagecountbyUserMontly', controller: 'Log', action: 'GetUsagecountbyUserMontly' },
    { method: 'get', path: '/Logs/GetProcessCount', controller: 'Log', action: 'GetProcessCount' },
    { method: 'get', path: '/Logs', controller: 'Log', action: 'GetLogs' },
    { method: 'post', path: '/Logs/GetByQuerry', controller: 'Log', action: 'GetLogsByQuerry' },
    { method: 'post', path: '/Logs', controller: 'Log', action: 'AddLog' },
]

module.exports = Routes