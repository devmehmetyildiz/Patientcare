const Routes = [
    { method: 'get', path: '/Patients/Preregistrations', controller: 'Patient', action: 'GetPreregistrations' },
    { method: 'get', path: '/Patients/GetFullpatients', controller: 'Patient', action: 'GetFullpatients' },
    { method: 'get', path: '/Patients/:patientId', controller: 'Patient', action: 'GetPatient' },
    { method: 'get', path: '/Patients', controller: 'Patient', action: 'GetPatients' },
    { method: 'post', path: '/Patients', controller: 'Patient', action: 'AddPatient' },
    { method: 'put', path: '/Patients/Preregistrations/Editpatientstocks', controller: 'Patient', action: 'Editpatientstocks' },
    { method: 'put', path: '/Patients/OutPatient/:patientId', controller: 'Patient', action: 'OutPatient' },
    { method: 'put', path: '/Patients/InPatient/:patientId', controller: 'Patient', action: 'InPatient' },
    { method: 'put', path: '/Patients/Preregistrations/Editstock', controller: 'Patient', action: 'Completeprepatient' },
    { method: 'put', path: '/Patients/UpdatePatientcase', controller: 'Patient', action: 'UpdatePatientcase' },
    { method: 'put', path: '/Patients/UpdatePatienttodogroupdefine', controller: 'Patient', action: 'UpdatePatienttodogroupdefine' },
    { method: 'put', path: '/Patients', controller: 'Patient', action: 'UpdatePatient' },
    { method: 'delete', path: '/Patients/:patientId', controller: 'Patient', action: 'DeletePatient' },

    { method: 'get', path: '/Patientdefines/:patientdefineId', controller: 'Patientdefine', action: 'GetPatientdefine' },
    { method: 'get', path: '/Patientdefines', controller: 'Patientdefine', action: 'GetPatientdefines' },
    { method: 'post', path: '/Patientdefines', controller: 'Patientdefine', action: 'AddPatientdefine' },
    { method: 'put', path: '/Patientdefines', controller: 'Patientdefine', action: 'UpdatePatientdefine' },
    { method: 'delete', path: '/Patientdefines/:patientdefineId', controller: 'Patientdefine', action: 'DeletePatientdefine' },

    { method: 'get', path: '/Patientmovements/:patientmovementId', controller: 'Patientmovement', action: 'GetPatientmovement' },
    { method: 'get', path: '/Patientmovements', controller: 'Patientmovement', action: 'GetPatientmovements' },
    { method: 'post', path: '/Patientmovements', controller: 'Patientmovement', action: 'AddPatientmovement' },
    { method: 'put', path: '/Patientmovements', controller: 'Patientmovement', action: 'UpdatePatientmovement' },
    { method: 'delete', path: '/Patientmovements/:patientmovementId', controller: 'Patientmovement', action: 'DeletePatientmovement' },

    { method: 'get', path: '/Todos/GetTodosbyPatientID/:patientId', controller: 'Todo', action: 'GetTodosbyPatientID' },
    { method: 'get', path: '/Todos/:todoId', controller: 'Todo', action: 'GetTodo' },
    { method: 'get', path: '/Todos', controller: 'Todo', action: 'GetTodos' },
    { method: 'post', path: '/Todos/Approve/:todoId', controller: 'Todo', action: 'ApproveTodo' },
    { method: 'post', path: '/Todos/AddPatienttodolist', controller: 'Todo', action: 'AddPatienttodolist' },
    { method: 'post', path: '/Todos', controller: 'Todo', action: 'AddTodo' },
    { method: 'put', path: '/Todos', controller: 'Todo', action: 'UpdateTodo' },
    { method: 'delete', path: '/Todos/:todoId', controller: 'Todo', action: 'DeleteTodo' },
]

module.exports = Routes