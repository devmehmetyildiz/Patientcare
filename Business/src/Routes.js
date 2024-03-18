const Routes = [
    { method: 'get', path: '/Patients/Preregistrations', controller: 'Patient', action: 'GetPreregistrations' },
    { method: 'get', path: '/Patients/GetFullpatients', controller: 'Patient', action: 'GetFullpatients' },
    { method: 'get', path: '/Patients/:patientId', controller: 'Patient', action: 'GetPatient' },
    { method: 'get', path: '/Patients', controller: 'Patient', action: 'GetPatients' },
    { method: 'post', path: '/Patients/Createfromtemplate', controller: 'Patient', action: 'Createfromtemplate' },
    { method: 'post', path: '/Patients/AddPatientReturnPatient', controller: 'Patient', action: 'AddPatientReturnPatient' },
    { method: 'post', path: '/Patients', controller: 'Patient', action: 'AddPatient' },
    { method: 'put', path: '/Patients/Preregistrations/Editpatientstocks', controller: 'Patient', action: 'Editpatientstocks' },
    { method: 'put', path: '/Patients/OutPatient/:patientId', controller: 'Patient', action: 'OutPatient' },
    { method: 'put', path: '/Patients/InPatient/:patientId', controller: 'Patient', action: 'InPatient' },
    { method: 'put', path: '/Patients/Preregistrations/Complete', controller: 'Patient', action: 'Completeprepatient' },
    { method: 'put', path: '/Patients/UpdatePatientcase', controller: 'Patient', action: 'UpdatePatientcase' },
    { method: 'put', path: '/Patients/UpdatePatientscase', controller: 'Patient', action: 'UpdatePatientscase' },
    { method: 'put', path: '/Patients/UpdatePatientplace', controller: 'Patient', action: 'UpdatePatientplace' },
    { method: 'put', path: '/Patients/TransferPatientplace', controller: 'Patient', action: 'TransferPatientplace' },
    { method: 'put', path: '/Patients/UpdatePatienttododefines', controller: 'Patient', action: 'UpdatePatienttododefines' },
    { method: 'put', path: '/Patients/UpdatePatientsupportplans', controller: 'Patient', action: 'UpdatePatientsupportplans' },
    { method: 'put', path: '/Patients', controller: 'Patient', action: 'UpdatePatient' },
    { method: 'delete', path: '/Patients/:patientId', controller: 'Patient', action: 'DeletePatient' },

    { method: 'get', path: '/Careplans/:careplanId', controller: 'Careplan', action: 'GetCareplan' },
    { method: 'get', path: '/Careplans', controller: 'Careplan', action: 'GetCareplans' },
    { method: 'post', path: '/Careplans', controller: 'Careplan', action: 'AddCareplan' },
    { method: 'put', path: '/Careplans/Approve/:careplanId', controller: 'Careplan', action: 'ApproveCareplan' },
    { method: 'put', path: '/Careplans', controller: 'Careplan', action: 'UpdateCareplan' },
    { method: 'delete', path: '/Careplans/:careplanId', controller: 'Careplan', action: 'DeleteCareplan' },

    { method: 'get', path: '/Professions/:professionId', controller: 'Profession', action: 'GetProfession' },
    { method: 'get', path: '/Professions', controller: 'Profession', action: 'GetProfessions' },
    { method: 'post', path: '/Professions', controller: 'Profession', action: 'AddProfession' },
    { method: 'put', path: '/Professions', controller: 'Profession', action: 'UpdateProfession' },
    { method: 'delete', path: '/Professions/:professionId', controller: 'Profession', action: 'DeleteProfession' },

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

    { method: 'get', path: '/Personels/:personelId', controller: 'Personel', action: 'GetPersonel' },
    { method: 'get', path: '/Personels', controller: 'Personel', action: 'GetPersonels' },
    { method: 'post', path: '/Personels/Addrecord', controller: 'Personel', action: 'AddRecordPersonel' },
    { method: 'post', path: '/Personels', controller: 'Personel', action: 'AddPersonel' },
    { method: 'put', path: '/Personels', controller: 'Personel', action: 'UpdatePersonel' },
    { method: 'delete', path: '/Personels/:personelId', controller: 'Personel', action: 'DeletePersonel' },

    { method: 'get', path: '/Companycashmovements/:movementId', controller: 'Companycashmovement', action: 'GetCompanycashmovement' },
    { method: 'get', path: '/Companycashmovements', controller: 'Companycashmovement', action: 'GetCompanycashmovements' },
    { method: 'post', path: '/Companycashmovements', controller: 'Companycashmovement', action: 'AddCompanycashmovement' },
    { method: 'put', path: '/Companycashmovements', controller: 'Companycashmovement', action: 'UpdateCompanycashmovement' },
    { method: 'delete', path: '/Companycashmovements/:movementId', controller: 'Companycashmovement', action: 'DeleteCompanycashmovement' },

    { method: 'get', path: '/Patientcashmovements/:movementId', controller: 'Patientcashmovement', action: 'GetPatientcashmovement' },
    { method: 'get', path: '/Patientcashmovements', controller: 'Patientcashmovement', action: 'GetPatientcashmovements' },
    { method: 'post', path: '/Patientcashmovements', controller: 'Patientcashmovement', action: 'AddPatientcashmovement' },
    { method: 'put', path: '/Patientcashmovements', controller: 'Patientcashmovement', action: 'UpdatePatientcashmovement' },
    { method: 'delete', path: '/Patientcashmovements/:movementId', controller: 'Patientcashmovement', action: 'DeletePatientcashmovement' },

    { method: 'get', path: '/Patientcashregisters/:cashregisterId', controller: 'Patientcashregister', action: 'GetPatientcashregister' },
    { method: 'get', path: '/Patientcashregisters', controller: 'Patientcashregister', action: 'GetPatientcashregisters' },
    { method: 'post', path: '/Patientcashregisters', controller: 'Patientcashregister', action: 'AddPatientcashregister' },
    { method: 'put', path: '/Patientcashregisters', controller: 'Patientcashregister', action: 'UpdatePatientcashregister' },
    { method: 'delete', path: '/Patientcashregisters/:cashregisterId', controller: 'Patientcashregister', action: 'DeletePatientcashregister' },

    { method: 'get', path: '/Shifts/:shiftId', controller: 'Shift', action: 'GetShift' },
    { method: 'get', path: '/Shifts', controller: 'Shift', action: 'GetShifts' },
    { method: 'post', path: '/Shifts', controller: 'Shift', action: 'AddShift' },
    { method: 'put', path: '/Shifts', controller: 'Shift', action: 'UpdateShift' },
    { method: 'delete', path: '/Shifts/:shiftId', controller: 'Shift', action: 'DeleteShift' },
   
    { method: 'get', path: '/Professionpresettings/:professionpresettingId', controller: 'Professionpresetting', action: 'GetProfessionpresetting' },
    { method: 'get', path: '/Professionpresettings', controller: 'Professionpresetting', action: 'GetProfessionpresettings' },
    { method: 'post', path: '/Professionpresettings', controller: 'Professionpresetting', action: 'AddProfessionpresetting' },
    { method: 'put', path: '/Professionpresettings', controller: 'Professionpresetting', action: 'UpdateProfessionpresetting' },
    { method: 'delete', path: '/Professionpresettings/:professionpresettingId', controller: 'Professionpresetting', action: 'DeleteProfessionpresetting' },
   
    { method: 'get', path: '/Personelpresettings/:personelpresettingId', controller: 'Personelpresetting', action: 'GetPersonelpresetting' },
    { method: 'get', path: '/Personelpresettings', controller: 'Personelpresetting', action: 'GetPersonelpresettings' },
    { method: 'post', path: '/Personelpresettings', controller: 'Personelpresetting', action: 'AddPersonelpresetting' },
    { method: 'put', path: '/Personelpresettings', controller: 'Personelpresetting', action: 'UpdatePersonelpresetting' },
    { method: 'delete', path: '/Personelpresettings/:personelpresettingId', controller: 'Personelpresetting', action: 'DeletePersonelpresetting' },

    { method: 'get', path: '/Todos/GetTodosbyPatientID/:patientId', controller: 'Todo', action: 'GetTodosbyPatientID' },
    { method: 'get', path: '/Todos/:todoId', controller: 'Todo', action: 'GetTodo' },
    { method: 'get', path: '/Todos', controller: 'Todo', action: 'GetTodos' },
    { method: 'post', path: '/Todos/Approve/:todoId', controller: 'Todo', action: 'ApproveTodo' },
    { method: 'post', path: '/Todos/Approve', controller: 'Todo', action: 'ApproveTodos' },
    { method: 'post', path: '/Todos/AddPatienttodolist', controller: 'Todo', action: 'AddPatienttodolist' },
    { method: 'post', path: '/Todos', controller: 'Todo', action: 'AddTodo' },
    { method: 'put', path: '/Todos', controller: 'Todo', action: 'UpdateTodo' },
    { method: 'delete', path: '/Todos/:todoId', controller: 'Todo', action: 'DeleteTodo' },
]

module.exports = Routes