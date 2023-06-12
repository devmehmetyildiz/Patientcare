const Routes = [
    { method: 'get', path: '/Patients/Preregistrations', controller: 'Patient', action: 'GetPreregistrations' },
    { method: 'get', path: '/Patients/GetFullpatients', controller: 'Patient', action: 'GetFullpatients' },
    { method: 'get', path: '/Patients/:patientId', controller: 'Patient', action: 'GetPatient' },
    { method: 'get', path: '/Patients', controller: 'Patient', action: 'GetPatients' },
    { method: 'post', path: '/Patients', controller: 'Patient', action: 'AddPatient' },
    { method: 'put', path: '/Patients/Preregistrations/Editpatientstocks', controller: 'Patient', action: 'Editpatientstocks' },
    { method: 'put', path: '/Patients/Preregistrations/Complete', controller: 'Patient', action: 'Completeprepatient' },
    { method: 'put', path: '/Patients/Preregistrations/Editstock', controller: 'Patient', action: 'Completeprepatient' },
    { method: 'put', path: '/Patients', controller: 'Patient', action: 'UpdatePatient' },
    { method: 'delete', path: '/Patients', controller: 'Patient', action: 'DeletePatient' },

    { method: 'get', path: '/Patientdefines/:patientdefineId', controller: 'Patientdefine', action: 'GetPatientdefine' },
    { method: 'get', path: '/Patientdefines', controller: 'Patientdefine', action: 'GetPatientdefines' },
    { method: 'post', path: '/Patientdefines', controller: 'Patientdefine', action: 'AddPatientdefine' },
    { method: 'put', path: '/Patientdefines', controller: 'Patientdefine', action: 'UpdatePatientdefine' },
    { method: 'delete', path: '/Patientdefines', controller: 'Patientdefine', action: 'DeletePatientdefine' },
]

module.exports = Routes