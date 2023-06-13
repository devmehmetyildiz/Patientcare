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



]

module.exports = Routes