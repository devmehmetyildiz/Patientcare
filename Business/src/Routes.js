const Routes = [
    { method: 'get', path: '/Patientdefines/:patientdefineId', controller: 'Patientdefine', action: 'GetPatientdefine' },
    { method: 'get', path: '/Patientdefines', controller: 'Patientdefine', action: 'GetPatientdefines' },
    { method: 'post', path: '/Patientdefines', controller: 'Patientdefine', action: 'AddPatientdefine' },
    { method: 'put', path: '/Patientdefines', controller: 'Patientdefine', action: 'UpdatePatientdefine' },
    { method: 'delete', path: '/Patientdefines', controller: 'Patientdefine', action: 'DeletePatientdefine' },
]

module.exports = Routes