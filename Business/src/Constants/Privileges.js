const Priveleges = [
    { code: 'basic', text: 'Basic', group: ['BaseGroup'], required: [] },
    { code: 'admin', text: 'Admin', group: ['BaseGroup'], required: [] },

    { code: 'userscreen', text: 'User Screen', group: ['User'], required: [] },
    { code: 'useradd', text: 'User Add', group: ['User'], required: [] },
    { code: 'userupdate', text: 'User Update', group: ['User'], required: [] },
    { code: 'userdelete', text: 'User Delete', group: ['User'], required: [] },
    { code: 'usermanageAll', text: 'User ManageAll', group: ['User'], required: [] },

    { code: 'departmentscreen', text: 'Department Screen', group: ['Department'], required: [] },
    { code: 'departmentadd', text: 'Department Add', group: ['Department'], required: [] },
    { code: 'departmentupdate', text: 'Department Update', group: ['Department'], required: [] },
    { code: 'departmentdelete', text: 'Department Delete', group: ['Department'], required: [] },
    { code: 'departmentmanageAll', text: 'Department ManageAll', group: ['Department'], required: [] },

    { code: 'stockscreen', text: 'Stock Screen', group: ['Stock'], required: [] },
    { code: 'stockadd', text: 'Stock Add', group: ['Stock'], required: [] },
    { code: 'stockupdate', text: 'Stock Update', group: ['Stock'], required: [] },
    { code: 'stockdelete', text: 'Stock Delete', group: ['Stock'], required: [] },
    { code: 'stockmanageAll', text: 'Stock ManageAll', group: ['Stock'], required: [] },

    { code: 'processscreen', text: 'Process Screen', group: ['Process'], required: [] },
    { code: 'processadd', text: 'Process Add', group: ['Process'], required: [] },
    { code: 'processupdate', text: 'Process Update', group: ['Process'], required: [] },
    { code: 'processdelete', text: 'Process Delete', group: ['Process'], required: [] },
    { code: 'processmanageAll', text: 'Process ManageAll', group: ['Process'], required: [] },

    { code: 'patientsscreen', text: 'Patients Screen', group: ['Patients'], required: [] },
    { code: 'patientsadd', text: 'Patients Add', group: ['Patients'], required: [] },
    { code: 'patientsupdate', text: 'Patients Update', group: ['Patients'], required: [] },
    { code: 'patientsdelete', text: 'Patients Delete', group: ['Patients'], required: [] },
    { code: 'patientsmanageAll', text: 'Patients ManageAll', group: ['Patients'], required: [] },
    { code: 'patientuploadFile', text: 'Patient UploadFile', group: ['Patients'], required: [] },
    { code: 'patientdownloadFile', text: 'Patient DownloadFile', group: ['Patients'], required: [] },
    { code: 'patientviewFile', text: 'Patient ViewFile', group: ['Patients'], required: [] },

    { code: 'patienttypescreen', text: 'Patienttype Screen', group: ['Patienttype'], required: [] },
    { code: 'patienttypeadd', text: 'Patienttype Add', group: ['Patienttype'], required: [] },
    { code: 'patienttypeupdate', text: 'Patienttype Update', group: ['Patienttype'], required: [] },
    { code: 'patienttypedelete', text: 'Patienttype Delete', group: ['Patienttype'], required: [] },
    { code: 'patienttypemanageAll', text: 'Patienttype ManageAll', group: ['Patienttype'], required: [] },

    { code: 'unitscreen', text: 'Unit Screen', group: ['Unit'], required: [] },
    { code: 'unitadd', text: 'Unit Add', group: ['Unit'], required: [] },
    { code: 'unitupdate', text: 'Unit Update', group: ['Unit'], required: [] },
    { code: 'unitdelete', text: 'Unit Delete', group: ['Unit'], required: [] },
    { code: 'unitmanageAll', text: 'Unit ManageAll', group: ['Unit'], required: [] },

    { code: 'casescreen', text: 'Case Screen', group: ['Case'], required: [] },
    { code: 'caseadd', text: 'Case Add', group: ['Case'], required: [] },
    { code: 'caseupdate', text: 'Case Update', group: ['Case'], required: [] },
    { code: 'casedelete', text: 'Case Delete', group: ['Case'], required: [] },
    { code: 'casemanageAll', text: 'Case ManageAll', group: ['Case'], required: [] },

    { code: 'costumertypescreen', text: 'Costumertype Screen', group: ['Costumertype'], required: [] },
    { code: 'costumertypeadd', text: 'Costumertype Add', group: ['Costumertype'], required: [] },
    { code: 'costumertypeupdate', text: 'Costumertype Update', group: ['Costumertype'], required: [] },
    { code: 'costumertypedelete', text: 'Costumertype Delete', group: ['Costumertype'], required: [] },
    { code: 'costumertypemanageAll', text: 'Costumertype ManageAll', group: ['Costumertype'], required: [] },

    { code: 'rolesscreen', text: 'Roles Screen', group: ['Roles'], required: [] },
    { code: 'rolesadd', text: 'Roles Add', group: ['Roles'], required: [] },
    { code: 'rolesupdate', text: 'Roles Update', group: ['Roles'], required: [] },
    { code: 'rolesdelete', text: 'Roles Delete', group: ['Roles'], required: [] },
    { code: 'rolesmanageAll', text: 'Roles ManageAll', group: ['Roles'], required: [] },

    { code: 'stationsscreen', text: 'Stations Screen', group: ['Stations'], required: [] },
    { code: 'stationsadd', text: 'Stations Add', group: ['Stations'], required: [] },
    { code: 'stationsupdate', text: 'Stations Update', group: ['Stations'], required: [] },
    { code: 'stationsdelete', text: 'Stations Delete', group: ['Stations'], required: [] },
    { code: 'stationsmanageAll', text: 'Stations ManageAll', group: ['Stations'], required: [] },

    { code: 'filescreen', text: 'File Screen', group: ['File'], required: [] },
    { code: 'fileadd', text: 'File Add', group: ['File'], required: [] },
    { code: 'fileupdate', text: 'File Update', group: ['File'], required: [] },
    { code: 'filedelete', text: 'File Delete', group: ['File'], required: [] },
    { code: 'filemanageAll', text: 'File ManageAll', group: ['File'], required: [] },

    { code: 'dashboardallScreen', text: 'Dashboard AllScreen', group: ['Dashboard'], required: [] },
    { code: 'dashboarddepartmentScreen', text: 'Dashboard DepartmentScreen', group: ['Dashboard'], required: [] },

    { code: 'remindingscreen', text: 'Reminding Screen', group: ['Reminding'], required: [] },
    { code: 'remindingadd', text: 'Reminding Add', group: ['Reminding'], required: [] },
    { code: 'remindingupdate', text: 'Reminding Update', group: ['Reminding'], required: [] },
    { code: 'remindingdelete', text: 'Reminding Delete', group: ['Reminding'], required: [] },
    { code: 'remindingmanageAll', text: 'Reminding ManageAll', group: ['Reminding'], required: [] },
    { code: 'remindingdefineforAll', text: 'Reminding DefineforAll', group: ['Reminding'], required: [] },
    { code: 'remindingdefine', text: 'Reminding Define', group: ['Reminding'], required: [] },
]

module.exports = Priveleges