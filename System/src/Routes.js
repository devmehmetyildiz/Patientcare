const Routes = [
    { method: 'get', path: '/Mailsettings/:mailsettingId', controller: 'Mailsetting', action: 'GetMailsetting' },
    { method: 'get', path: '/Mailsettings', controller: 'Mailsetting', action: 'GetMailsettings' },
    { method: 'post', path: '/Mailsettings', controller: 'Mailsetting', action: 'AddMailsetting' },
    { method: 'put', path: '/Mailsettings', controller: 'Mailsetting', action: 'UpdateMailsetting' },
    { method: 'delete', path: '/Mailsettings/:mailsettingId', controller: 'Mailsetting', action: 'DeleteMailsetting' },

    { method: 'get', path: '/Printtemplates/:printtemplateId', controller: 'Printtemplate', action: 'GetPrinttemplate' },
    { method: 'get', path: '/Printtemplates', controller: 'Printtemplate', action: 'GetPrinttemplates' },
    { method: 'post', path: '/Printtemplates', controller: 'Printtemplate', action: 'AddPrinttemplate' },
    { method: 'put', path: '/Printtemplates', controller: 'Printtemplate', action: 'UpdatePrinttemplate' },
    { method: 'delete', path: '/Printtemplates/:printtemplateId', controller: 'Printtemplate', action: 'DeletePrinttemplate' },

    { method: 'get', path: '/Rules/Getrulelogs/:ruleId', controller: 'Rule', action: 'GetRulelogs' },
    { method: 'get', path: '/Rules/:ruleId', controller: 'Rule', action: 'GetRule' },
    { method: 'get', path: '/Rules', controller: 'Rule', action: 'GetRules' },
    { method: 'post', path: '/Rules', controller: 'Rule', action: 'AddRule' },
    { method: 'put', path: '/Rules', controller: 'Rule', action: 'UpdateRule' },
    { method: 'delete', path: '/Rules/StopRule/:ruleId', controller: 'Rule', action: 'StopRule' },
    { method: 'delete', path: '/Rules/Clearrulelogs/:ruleId', controller: 'Rule', action: 'ClearRulelogs' },
    { method: 'delete', path: '/Rules/:ruleId', controller: 'Rule', action: 'DeleteRule' },

]

module.exports = Routes