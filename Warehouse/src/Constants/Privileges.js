const Priveleges = [
    { code: 'basic', text: 'Basic', group: ['BaseGroup'], required: [] },
    { code: 'admin', text: 'Admin', group: ['BaseGroup'], required: [] },

    { code: 'bedscreen', text: 'Beds Screen', group: ['Beds'], required: [] },
    { code: 'bedview', text: 'Beds View', group: ['Beds'], required: [] },
    { code: 'bedadd', text: 'Beds Add', group: ['Beds'], required: [] },
    { code: 'bedupdate', text: 'Beds Update', group: ['Beds'], required: [] },
    { code: 'beddelete', text: 'Beds Delete', group: ['Beds'], required: [] },
    { code: 'bedmanageview', text: 'Beds Manage View', group: ['Beds'], required: [] },
    { code: 'bedgetreport', text: 'Beds Get Report', group: ['Beds'], required: [] },

    { code: 'casescreen', text: 'Cases Screen', group: ['Cases'], required: [] },
    { code: 'caseview', text: 'Cases View', group: ['Cases'], required: [] },
    { code: 'caseadd', text: 'Cases Add', group: ['Cases'], required: [] },
    { code: 'caseupdate', text: 'Cases Update', group: ['Cases'], required: [] },
    { code: 'casedelete', text: 'Cases Delete', group: ['Cases'], required: [] },
    { code: 'casemanageview', text: 'Cases Manage View', group: ['Cases'], required: [] },
    { code: 'casegetreport', text: 'Cases Get Report', group: ['Cases'], required: [] },

    { code: 'checkperiodscreen', text: 'Checkperiods Screen', group: ['Checkperiods'], required: [] },
    { code: 'checkperiodview', text: 'Checkperiods View', group: ['Checkperiods'], required: [] },
    { code: 'checkperiodadd', text: 'Checkperiods Add', group: ['Checkperiods'], required: [] },
    { code: 'checkperiodupdate', text: 'Checkperiods Update', group: ['Checkperiods'], required: [] },
    { code: 'checkperioddelete', text: 'Checkperiods Delete', group: ['Checkperiods'], required: [] },
    { code: 'checkperiodmanageview', text: 'Checkperiods Manage View', group: ['Checkperiods'], required: [] },
    { code: 'checkperiodgetreport', text: 'Checkperiods Get Report', group: ['Checkperiods'], required: [] },

    { code: 'costumertypescreen', text: 'Costumertypes Screen', group: ['Costumertypes'], required: [] },
    { code: 'costumertypeview', text: 'Costumertypes View', group: ['Costumertypes'], required: [] },
    { code: 'costumertypeadd', text: 'Costumertypes Add', group: ['Costumertypes'], required: [] },
    { code: 'costumertypeupdate', text: 'Costumertypes Update', group: ['Costumertypes'], required: [] },
    { code: 'costumertypedelete', text: 'Costumertypes Delete', group: ['Costumertypes'], required: [] },
    { code: 'costumertypemanageview', text: 'Costumertypes Manage View', group: ['Costumertypes'], required: [] },
    { code: 'costumertypegetreport', text: 'Costumertypes Get Report', group: ['Costumertypes'], required: [] },

    { code: 'departmentscreen', text: 'Departments Screen', group: ['Departments'], required: [] },
    { code: 'departmentview', text: 'Departments View', group: ['Departments'], required: [] },
    { code: 'departmentadd', text: 'Departments Add', group: ['Departments'], required: [] },
    { code: 'departmentupdate', text: 'Departments Update', group: ['Departments'], required: [] },
    { code: 'departmentdelete', text: 'Departments Delete', group: ['Departments'], required: [] },
    { code: 'departmentmanageview', text: 'Departments Manage View', group: ['Departments'], required: [] },
    { code: 'departmentgetreport', text: 'Departments Get Report', group: ['Departments'], required: [] },

    { code: 'floorscreen', text: 'Floors Screen', group: ['Floors'], required: [] },
    { code: 'floorview', text: 'Floors View', group: ['Floors'], required: [] },
    { code: 'flooradd', text: 'Floors Add', group: ['Floors'], required: [] },
    { code: 'floorupdate', text: 'Floors Update', group: ['Floors'], required: [] },
    { code: 'floordelete', text: 'Floors Delete', group: ['Floors'], required: [] },
    { code: 'floormanageview', text: 'Floors Manage View', group: ['Floors'], required: [] },
    { code: 'floorgetreport', text: 'Floors Get Report', group: ['Floors'], required: [] },

    { code: 'patienttypescreen', text: 'Patienttypes Screen', group: ['Patienttypes'], required: [] },
    { code: 'patienttypeview', text: 'Patienttypes View', group: ['Patienttypes'], required: [] },
    { code: 'patienttypeadd', text: 'Patienttypes Add', group: ['Patienttypes'], required: [] },
    { code: 'patienttypeupdate', text: 'Patienttypes Update', group: ['Patienttypes'], required: [] },
    { code: 'patienttypedelete', text: 'Patienttypes Delete', group: ['Patienttypes'], required: [] },
    { code: 'patienttypemanageview', text: 'Patienttypes Manage View', group: ['Patienttypes'], required: [] },
    { code: 'patienttypegetreport', text: 'Patienttypes Get Report', group: ['Patienttypes'], required: [] },

    { code: 'periodscreen', text: 'Periods Screen', group: ['Periods'], required: [] },
    { code: 'periodview', text: 'Periods View', group: ['Periods'], required: [] },
    { code: 'periodadd', text: 'Periods Add', group: ['Periods'], required: [] },
    { code: 'periodupdate', text: 'Periods Update', group: ['Periods'], required: [] },
    { code: 'perioddelete', text: 'Periods Delete', group: ['Periods'], required: [] },
    { code: 'periodmanageview', text: 'Periods Manage View', group: ['Periods'], required: [] },
    { code: 'periodgetreport', text: 'Periods Get Report', group: ['Periods'], required: [] },

    { code: 'roomscreen', text: 'Rooms Screen', group: ['Rooms'], required: [] },
    { code: 'roomview', text: 'Rooms View', group: ['Rooms'], required: [] },
    { code: 'roomadd', text: 'Rooms Add', group: ['Rooms'], required: [] },
    { code: 'roomupdate', text: 'Rooms Update', group: ['Rooms'], required: [] },
    { code: 'roomdelete', text: 'Rooms Delete', group: ['Rooms'], required: [] },
    { code: 'roommanageview', text: 'Rooms Manage View', group: ['Rooms'], required: [] },
    { code: 'roomgetreport', text: 'Rooms Get Report', group: ['Rooms'], required: [] },

    { code: 'shiftscreen', text: 'Shifts Screen', group: ['Shifts'], required: [] },
    { code: 'shiftview', text: 'Shifts View', group: ['Shifts'], required: [] },
    { code: 'shiftadd', text: 'Shifts Add', group: ['Shifts'], required: [] },
    { code: 'shiftupdate', text: 'Shifts Update', group: ['Shifts'], required: [] },
    { code: 'shiftdelete', text: 'Shifts Delete', group: ['Shifts'], required: [] },
    { code: 'shiftmanageview', text: 'Shifts Manage View', group: ['Shifts'], required: [] },
    { code: 'shiftgetreport', text: 'Shifts Get Report', group: ['Shifts'], required: [] },

    { code: 'stationscreen', text: 'Stations Screen', group: ['Stations'], required: [] },
    { code: 'stationview', text: 'Stations View', group: ['Stations'], required: [] },
    { code: 'stationadd', text: 'Stations Add', group: ['Stations'], required: [] },
    { code: 'stationupdate', text: 'Stations Update', group: ['Stations'], required: [] },
    { code: 'stationdelete', text: 'Stations Delete', group: ['Stations'], required: [] },
    { code: 'stationmanageview', text: 'Stations Manage View', group: ['Stations'], required: [] },
    { code: 'stationgetreport', text: 'Stations Get Report', group: ['Stations'], required: [] },

    { code: 'tododefinescreen', text: 'Tododefines Screen', group: ['Tododefines'], required: [] },
    { code: 'tododefineview', text: 'Tododefines View', group: ['Tododefines'], required: [] },
    { code: 'tododefineadd', text: 'Tododefines Add', group: ['Tododefines'], required: [] },
    { code: 'tododefineupdate', text: 'Tododefines Update', group: ['Tododefines'], required: [] },
    { code: 'tododefinedelete', text: 'Tododefines Delete', group: ['Tododefines'], required: [] },
    { code: 'tododefinemanageview', text: 'Tododefines Manage View', group: ['Tododefines'], required: [] },
    { code: 'tododefinegetreport', text: 'Tododefines Get Report', group: ['Tododefines'], required: [] },

    { code: 'todogroupdefinescreen', text: 'Todogroupdefines Screen', group: ['Todogroupdefines'], required: [] },
    { code: 'todogroupdefineview', text: 'Todogroupdefines View', group: ['Todogroupdefines'], required: [] },
    { code: 'todogroupdefineadd', text: 'Todogroupdefines Add', group: ['Todogroupdefines'], required: [] },
    { code: 'todogroupdefineupdate', text: 'Todogroupdefines Update', group: ['Todogroupdefines'], required: [] },
    { code: 'todogroupdefinedelete', text: 'Todogroupdefines Delete', group: ['Todogroupdefines'], required: [] },
    { code: 'todogroupdefinemanageview', text: 'Todogroupdefines Manage View', group: ['Todogroupdefines'], required: [] },
    { code: 'todogroupdefinegetreport', text: 'Todogroupdefines Get Report', group: ['Todogroupdefines'], required: [] },

    { code: 'unitscreen', text: 'Units Screen', group: ['Units'], required: [] },
    { code: 'unitview', text: 'Units View', group: ['Units'], required: [] },
    { code: 'unitadd', text: 'Units Add', group: ['Units'], required: [] },
    { code: 'unitupdate', text: 'Units Update', group: ['Units'], required: [] },
    { code: 'unitdelete', text: 'Units Delete', group: ['Units'], required: [] },
    { code: 'unitmanageview', text: 'Units Manage View', group: ['Units'], required: [] },
    { code: 'unitgetreport', text: 'Units Get Report', group: ['Units'], required: [] },

    { code: 'mailsettingscreen', text: 'Mailsettings Screen', group: ['Mailsettings'], required: [] },
    { code: 'mailsettingview', text: 'Mailsettings View', group: ['Mailsettings'], required: [] },
    { code: 'mailsettingadd', text: 'Mailsettings Add', group: ['Mailsettings'], required: [] },
    { code: 'mailsettingupdate', text: 'Mailsettings Update', group: ['Mailsettings'], required: [] },
    { code: 'mailsettingdelete', text: 'Mailsettings Delete', group: ['Mailsettings'], required: [] },
    { code: 'mailsettingmanageview', text: 'Mailsettings Manage View', group: ['Mailsettings'], required: [] },
    { code: 'mailsettinggetreport', text: 'Mailsettings Get Report', group: ['Mailsettings'], required: [] },

    { code: 'printtemplatescreen', text: 'Printtemplates Screen', group: ['Printtemplates'], required: [] },
    { code: 'printtemplateview', text: 'Printtemplates View', group: ['Printtemplates'], required: [] },
    { code: 'printtemplateadd', text: 'Printtemplates Add', group: ['Printtemplates'], required: [] },
    { code: 'printtemplateupdate', text: 'Printtemplates Update', group: ['Printtemplates'], required: [] },
    { code: 'printtemplatedelete', text: 'Printtemplates Delete', group: ['Printtemplates'], required: [] },
    { code: 'printtemplatemanageview', text: 'Printtemplates Manage View', group: ['Printtemplates'], required: [] },
    { code: 'printtemplategetreport', text: 'Printtemplates Get Report', group: ['Printtemplates'], required: [] },

    { code: 'rulescreen', text: 'Rules Screen', group: ['Rules'], required: [] },
    { code: 'ruleview', text: 'Rules View', group: ['Rules'], required: [] },
    { code: 'ruleadd', text: 'Rules Add', group: ['Rules'], required: [] },
    { code: 'ruleupdate', text: 'Rules Update', group: ['Rules'], required: [] },
    { code: 'ruledelete', text: 'Rules Delete', group: ['Rules'], required: [] },
    { code: 'rulemanageview', text: 'Rules Manage View', group: ['Rules'], required: [] },
    { code: 'rulegetreport', text: 'Rules Get Report', group: ['Rules'], required: [] },

    { code: 'patientstockscreen', text: 'Patientstocks Screen', group: ['Patientstocks'], required: [] },
    { code: 'patientstockview', text: 'Patientstocks View', group: ['Patientstocks'], required: [] },
    { code: 'patientstockadd', text: 'Patientstocks Add', group: ['Patientstocks'], required: [] },
    { code: 'patientstockupdate', text: 'Patientstocks Update', group: ['Patientstocks'], required: [] },
    { code: 'patientstockdelete', text: 'Patientstocks Delete', group: ['Patientstocks'], required: [] },
    { code: 'patientstockmanageview', text: 'Patientstocks Manage View', group: ['Patientstocks'], required: [] },
    { code: 'patientstockgetreport', text: 'Patientstocks Get Report', group: ['Patientstocks'], required: [] },

    { code: 'patientstockmovementscreen', text: 'Patientstockmovements Screen', group: ['Patientstockmovements'], required: [] },
    { code: 'patientstockmovementview', text: 'Patientstockmovements View', group: ['Patientstockmovements'], required: [] },
    { code: 'patientstockmovementadd', text: 'Patientstockmovements Add', group: ['Patientstockmovements'], required: [] },
    { code: 'patientstockmovementupdate', text: 'Patientstockmovements Update', group: ['Patientstockmovements'], required: [] },
    { code: 'patientstockmovementdelete', text: 'Patientstockmovements Delete', group: ['Patientstockmovements'], required: [] },
    { code: 'patientstockmovementmanageview', text: 'Patientstockmovements Manage View', group: ['Patientstockmovements'], required: [] },
    { code: 'patientstockmovementgetreport', text: 'Patientstockmovements Get Report', group: ['Patientstockmovements'], required: [] },

    { code: 'purchaseorderscreen', text: 'Purchaseorders Screen', group: ['Purchaseorders'], required: [] },
    { code: 'purchaseorderview', text: 'Purchaseorders View', group: ['Purchaseorders'], required: [] },
    { code: 'purchaseorderadd', text: 'Purchaseorders Add', group: ['Purchaseorders'], required: [] },
    { code: 'purchaseorderupdate', text: 'Purchaseorders Update', group: ['Purchaseorders'], required: [] },
    { code: 'purchaseorderdelete', text: 'Purchaseorders Delete', group: ['Purchaseorders'], required: [] },
    { code: 'purchaseordermanageview', text: 'Purchaseorders Manage View', group: ['Purchaseorders'], required: [] },
    { code: 'purchaseordergetreport', text: 'Purchaseorders Get Report', group: ['Purchaseorders'], required: [] },

    { code: 'purchaseorderstockscreen', text: 'Purchaseorderstocks Screen', group: ['Purchaseorderstocks'], required: [] },
    { code: 'purchaseorderstockview', text: 'Purchaseorderstocks View', group: ['Purchaseorderstocks'], required: [] },
    { code: 'purchaseorderstockadd', text: 'Purchaseorderstocks Add', group: ['Purchaseorderstocks'], required: [] },
    { code: 'purchaseorderstockupdate', text: 'Purchaseorderstocks Update', group: ['Purchaseorderstocks'], required: [] },
    { code: 'purchaseorderstockdelete', text: 'Purchaseorderstocks Delete', group: ['Purchaseorderstocks'], required: [] },
    { code: 'purchaseorderstockmanageview', text: 'Purchaseorderstocks Manage View', group: ['Purchaseorderstocks'], required: [] },
    { code: 'purchaseorderstockgetreport', text: 'Purchaseorderstocks Get Report', group: ['Purchaseorderstocks'], required: [] },

    { code: 'purchaseorderstockmovementscreen', text: 'Purchaseorderstockmovements Screen', group: ['Purchaseorderstockmovements'], required: [] },
    { code: 'purchaseorderstockmovementview', text: 'Purchaseorderstockmovements View', group: ['Purchaseorderstockmovements'], required: [] },
    { code: 'purchaseorderstockmovementadd', text: 'Purchaseorderstockmovements Add', group: ['Purchaseorderstockmovements'], required: [] },
    { code: 'purchaseorderstockmovementupdate', text: 'Purchaseorderstockmovements Update', group: ['Purchaseorderstockmovements'], required: [] },
    { code: 'purchaseorderstockmovementdelete', text: 'Purchaseorderstockmovements Delete', group: ['Purchaseorderstockmovements'], required: [] },
    { code: 'purchaseorderstockmovementmanageview', text: 'Purchaseorderstockmovements Manage View', group: ['Purchaseorderstockmovements'], required: [] },
    { code: 'purchaseorderstockmovementgetreport', text: 'Purchaseorderstockmovements Get Report', group: ['Purchaseorderstockmovements'], required: [] },

    { code: 'stockscreen', text: 'Stocks Screen', group: ['Stocks'], required: [] },
    { code: 'stockview', text: 'Stocks View', group: ['Stocks'], required: [] },
    { code: 'stockadd', text: 'Stocks Add', group: ['Stocks'], required: [] },
    { code: 'stockupdate', text: 'Stocks Update', group: ['Stocks'], required: [] },
    { code: 'stockdelete', text: 'Stocks Delete', group: ['Stocks'], required: [] },
    { code: 'stockmanageview', text: 'Stocks Manage View', group: ['Stocks'], required: [] },
    { code: 'stockgetreport', text: 'Stocks Get Report', group: ['Stocks'], required: [] },

    { code: 'stockdefinescreen', text: 'Stockdefines Screen', group: ['Stockdefines'], required: [] },
    { code: 'stockdefineview', text: 'Stockdefines View', group: ['Stockdefines'], required: [] },
    { code: 'stockdefineadd', text: 'Stockdefines Add', group: ['Stockdefines'], required: [] },
    { code: 'stockdefineupdate', text: 'Stockdefines Update', group: ['Stockdefines'], required: [] },
    { code: 'stockdefinedelete', text: 'Stockdefines Delete', group: ['Stockdefines'], required: [] },
    { code: 'stockdefinemanageview', text: 'Stockdefines Manage View', group: ['Stockdefines'], required: [] },
    { code: 'stockdefinegetreport', text: 'Stockdefines Get Report', group: ['Stockdefines'], required: [] },

    { code: 'stockmovementscreen', text: 'Stockmovements Screen', group: ['Stockmovements'], required: [] },
    { code: 'stockmovementview', text: 'Stockmovements View', group: ['Stockmovements'], required: [] },
    { code: 'stockmovementadd', text: 'Stockmovements Add', group: ['Stockmovements'], required: [] },
    { code: 'stockmovementupdate', text: 'Stockmovements Update', group: ['Stockmovements'], required: [] },
    { code: 'stockmovementdelete', text: 'Stockmovements Delete', group: ['Stockmovements'], required: [] },
    { code: 'stockmovementmanageview', text: 'Stockmovements Manage View', group: ['Stockmovements'], required: [] },
    { code: 'stockmovementgetreport', text: 'Stockmovements Get Report', group: ['Stockmovements'], required: [] },

    { code: 'warehousescreen', text: 'Warehouses Screen', group: ['Warehouses'], required: [] },
    { code: 'warehouseview', text: 'Warehouses View', group: ['Warehouses'], required: [] },
    { code: 'warehouseadd', text: 'Warehouses Add', group: ['Warehouses'], required: [] },
    { code: 'warehouseupdate', text: 'Warehouses Update', group: ['Warehouses'], required: [] },
    { code: 'warehousedelete', text: 'Warehouses Delete', group: ['Warehouses'], required: [] },
    { code: 'warehousemanageview', text: 'Warehouses Manage View', group: ['Warehouses'], required: [] },
    { code: 'warehousegetreport', text: 'Warehouses Get Report', group: ['Warehouses'], required: [] },

    { code: 'rolescreen', text: 'Roles Screen', group: ['Roles'], required: [] },
    { code: 'roleview', text: 'Roles View', group: ['Roles'], required: [] },
    { code: 'roleadd', text: 'Roles Add', group: ['Roles'], required: [] },
    { code: 'roleupdate', text: 'Roles Update', group: ['Roles'], required: [] },
    { code: 'roledelete', text: 'Roles Delete', group: ['Roles'], required: [] },
    { code: 'rolemanageview', text: 'Roles Manage View', group: ['Roles'], required: [] },
    { code: 'rolegetreport', text: 'Roles Get Report', group: ['Roles'], required: [] },

    { code: 'userscreen', text: 'Users Screen', group: ['Users'], required: [] },
    { code: 'userview', text: 'Users View', group: ['Users'], required: [] },
    { code: 'useradd', text: 'Users Add', group: ['Users'], required: [] },
    { code: 'userupdate', text: 'Users Update', group: ['Users'], required: [] },
    { code: 'userdelete', text: 'Users Delete', group: ['Users'], required: [] },
    { code: 'usermanageview', text: 'Users Manage View', group: ['Users'], required: [] },
    { code: 'usergetreport', text: 'Users Get Report', group: ['Users'], required: [] },

    { code: 'filescreen', text: 'Files Screen', group: ['Files'], required: [] },
    { code: 'fileview', text: 'Files View', group: ['Files'], required: [] },
    { code: 'fileadd', text: 'Files Add', group: ['Files'], required: [] },
    { code: 'fileupdate', text: 'Files Update', group: ['Files'], required: [] },
    { code: 'filedelete', text: 'Files Delete', group: ['Files'], required: [] },
    { code: 'filemanageview', text: 'Files Manage View', group: ['Files'], required: [] },
    { code: 'filegetreport', text: 'Files Get Report', group: ['Files'], required: [] },

    { code: 'patientscreen', text: 'Patients Screen', group: ['Patients'], required: [] },
    { code: 'patientview', text: 'Patients View', group: ['Patients'], required: [] },
    { code: 'patientadd', text: 'Patients Add', group: ['Patients'], required: [] },
    { code: 'patientupdate', text: 'Patients Update', group: ['Patients'], required: [] },
    { code: 'patientdelete', text: 'Patients Delete', group: ['Patients'], required: [] },
    { code: 'patientmanageview', text: 'Patients Manage View', group: ['Patients'], required: [] },
    { code: 'patientgetreport', text: 'Patients Get Report', group: ['Patients'], required: [] },

    { code: 'patientdefinescreen', text: 'Patientdefines Screen', group: ['Patientdefines'], required: [] },
    { code: 'patientdefineview', text: 'Patientdefines View', group: ['Patientdefines'], required: [] },
    { code: 'patientdefineadd', text: 'Patientdefines Add', group: ['Patientdefines'], required: [] },
    { code: 'patientdefineupdate', text: 'Patientdefines Update', group: ['Patientdefines'], required: [] },
    { code: 'patientdefinedelete', text: 'Patientdefines Delete', group: ['Patientdefines'], required: [] },
    { code: 'patientdefinemanageview', text: 'Patientdefines Manage View', group: ['Patientdefines'], required: [] },
    { code: 'patientdefinegetreport', text: 'Patientdefines Get Report', group: ['Patientdefines'], required: [] },

    { code: 'patientmovementscreen', text: 'Patientmovements Screen', group: ['Patientmovements'], required: [] },
    { code: 'patientmovementview', text: 'Patientmovements View', group: ['Patientmovements'], required: [] },
    { code: 'patientmovementadd', text: 'Patientmovements Add', group: ['Patientmovements'], required: [] },
    { code: 'patientmovementupdate', text: 'Patientmovements Update', group: ['Patientmovements'], required: [] },
    { code: 'patientmovementdelete', text: 'Patientmovements Delete', group: ['Patientmovements'], required: [] },
    { code: 'patientmovementmanageview', text: 'Patientmovements Manage View', group: ['Patientmovements'], required: [] },
    { code: 'patientmovementgetreport', text: 'Patientmovements Get Report', group: ['Patientmovements'], required: [] },

    { code: 'todoscreen', text: 'Todos Screen', group: ['Todos'], required: [] },
    { code: 'todoview', text: 'Todos View', group: ['Todos'], required: [] },
    { code: 'todoadd', text: 'Todos Add', group: ['Todos'], required: [] },
    { code: 'todoupdate', text: 'Todos Update', group: ['Todos'], required: [] },
    { code: 'tododelete', text: 'Todos Delete', group: ['Todos'], required: [] },
    { code: 'todomanageview', text: 'Todos Manage View', group: ['Todos'], required: [] },
    { code: 'todogetreport', text: 'Todos Get Report', group: ['Todos'], required: [] },

]

module.exports = Priveleges