const Routes = [
    { method: 'get', path: '/Patients/:patientId', controller: 'Patient', action: 'GetPatient' },
    { method: 'get', path: '/Patients', controller: 'Patient', action: 'GetPatients' },
    { method: 'post', path: '/Patients/GetPatientByPlace', controller: 'Patient', action: 'GetPatientByPlace' },
    { method: 'post', path: '/Patients/Createfromtemplate', controller: 'Patient', action: 'Createfromtemplate' },
    { method: 'post', path: '/Patients/AddPatienteventmovement', controller: 'Patient', action: 'AddPatienteventmovement' },
    { method: 'post', path: '/Patients', controller: 'Patient', action: 'AddPatient' },
    { method: 'put', path: '/Patients/Check', controller: 'Patient', action: 'CheckPatient' },
    { method: 'put', path: '/Patients/CancelCheck', controller: 'Patient', action: 'CancelCheckPatient' },
    { method: 'put', path: '/Patients/Approve', controller: 'Patient', action: 'ApprovePatient' },
    { method: 'put', path: '/Patients/CancelApprove', controller: 'Patient', action: 'CancelApprovePatient' },
    { method: 'put', path: '/Patients/Complete', controller: 'Patient', action: 'CompletePatient' },
    { method: 'put', path: '/Patients/PatientsRemove', controller: 'Patient', action: 'PatientsRemove' },
    { method: 'put', path: '/Patients/PatientsDead', controller: 'Patient', action: 'PatientsDead' },
    { method: 'put', path: '/Patients/PatientsMakeactive', controller: 'Patient', action: 'PatientsMakeactive' },
    { method: 'put', path: '/Patients/UpdatePatientcase', controller: 'Patient', action: 'UpdatePatientcase' },
    { method: 'put', path: '/Patients/UpdatePatientscase', controller: 'Patient', action: 'UpdatePatientscase' },
    { method: 'put', path: '/Patients/UpdatePatientplace', controller: 'Patient', action: 'UpdatePatientplace' },
    { method: 'put', path: '/Patients/TransferPatientplace', controller: 'Patient', action: 'TransferPatientplace' },
    { method: 'put', path: '/Patients/UpdatePatienttododefines', controller: 'Patient', action: 'UpdatePatienttododefines' },
    { method: 'put', path: '/Patients/UpdatePatientsupportplans', controller: 'Patient', action: 'UpdatePatientsupportplans' },
    { method: 'put', path: '/Patients/UpdatePatientDates', controller: 'Patient', action: 'UpdatePatientDates' },
    { method: 'put', path: '/Patients/UpdatePatientmovements', controller: 'Patient', action: 'UpdatePatientmovements' },
    { method: 'put', path: '/Patients/UpdatePatienteventmovements', controller: 'Patient', action: 'UpdatePatienteventmovements' },
    { method: 'put', path: '/Patients', controller: 'Patient', action: 'UpdatePatient' },
    { method: 'delete', path: '/Patients/DeletePatienteventmovement/:patienteventmovementId', controller: 'Patient', action: 'DeletePatienteventmovement' },
    { method: 'delete', path: '/Patients/DeletePatientmovement/:patientmovementId', controller: 'Patient', action: 'DeletePatientmovement' },
    { method: 'delete', path: '/Patients/DeletePreregisrations/:patientId', controller: 'Patient', action: 'DeletePreregisrations' },
    { method: 'delete', path: '/Patients/:patientId', controller: 'Patient', action: 'DeletePatient' },

    { method: 'get', path: '/Careplans/:careplanId', controller: 'Careplan', action: 'GetCareplan' },
    { method: 'get', path: '/Careplans', controller: 'Careplan', action: 'GetCareplans' },
    { method: 'post', path: '/Careplans', controller: 'Careplan', action: 'AddCareplan' },
    { method: 'put', path: '/Careplans/Savepreview/:careplanId', controller: 'Careplan', action: 'SavepreviewCareplan' },
    { method: 'put', path: '/Careplans/Approve/:careplanId', controller: 'Careplan', action: 'ApproveCareplan' },
    { method: 'put', path: '/Careplans', controller: 'Careplan', action: 'UpdateCareplan' },
    { method: 'delete', path: '/Careplans/:careplanId', controller: 'Careplan', action: 'DeleteCareplan' },

    { method: 'get', path: '/Trainings/:trainingId', controller: 'Training', action: 'GetTraining' },
    { method: 'get', path: '/Trainings', controller: 'Training', action: 'GetTrainings' },
    { method: 'post', path: '/Trainings', controller: 'Training', action: 'AddTraining' },
    { method: 'put', path: '/Trainings/CompleteTraininguser/:traininguserId', controller: 'Training', action: 'CompleteTraininguser' },
    { method: 'put', path: '/Trainings/Savepreview/:trainingId', controller: 'Training', action: 'SavepreviewTraining' },
    { method: 'put', path: '/Trainings/Complete/:trainingId', controller: 'Training', action: 'CompleteTraining' },
    { method: 'put', path: '/Trainings/Approve/:trainingId', controller: 'Training', action: 'ApproveTraining' },
    { method: 'put', path: '/Trainings', controller: 'Training', action: 'UpdateTraining' },
    { method: 'delete', path: '/Trainings/:trainingId', controller: 'Training', action: 'DeleteTraining' },

    { method: 'get', path: '/Claimpaymentparameters/:claimpaymentparameterId', controller: 'Claimpaymentparameter', action: 'GetClaimpaymentparameter' },
    { method: 'get', path: '/Claimpaymentparameters', controller: 'Claimpaymentparameter', action: 'GetClaimpaymentparameters' },
    { method: 'post', path: '/Claimpaymentparameters', controller: 'Claimpaymentparameter', action: 'AddClaimpaymentparameter' },
    { method: 'put', path: '/Claimpaymentparameters/Approve/:claimpaymentparameterId', controller: 'Claimpaymentparameter', action: 'ApproveClaimpaymentparameter' },
    { method: 'put', path: '/Claimpaymentparameters/Activate/:claimpaymentparameterId', controller: 'Claimpaymentparameter', action: 'ActivateClaimpaymentparameter' },
    { method: 'put', path: '/Claimpaymentparameters/Deactivate/:claimpaymentparameterId', controller: 'Claimpaymentparameter', action: 'DeactivateClaimpaymentparameter' },
    { method: 'put', path: '/Claimpaymentparameters/Savepreview/:claimpaymentparameterId', controller: 'Claimpaymentparameter', action: 'SavepreviewClaimpaymentparameter' },
    { method: 'put', path: '/Claimpaymentparameters', controller: 'Claimpaymentparameter', action: 'UpdateClaimpaymentparameter' },
    { method: 'delete', path: '/Claimpaymentparameters/:claimpaymentparameterId', controller: 'Claimpaymentparameter', action: 'DeleteClaimpaymentparameter' },

    { method: 'get', path: '/Claimpayments/:claimpaymentId', controller: 'Claimpayment', action: 'GetClaimpayment' },
    { method: 'get', path: '/Claimpayments', controller: 'Claimpayment', action: 'GetClaimpayments' },
    { method: 'post', path: '/Claimpayments', controller: 'Claimpayment', action: 'AddClaimpayment' },
    { method: 'put', path: '/Claimpayments/Approve/:claimpaymentId', controller: 'Claimpayment', action: 'ApproveClaimpayment' },
    { method: 'put', path: '/Claimpayments/Savepreview/:claimpaymentId', controller: 'Claimpayment', action: 'SavepreviewClaimpayment' },
    { method: 'delete', path: '/Claimpayments/:claimpaymentId', controller: 'Claimpayment', action: 'DeleteClaimpayment' },

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

    { method: 'get', path: '/Patienteventdefines/:patienteventdefineId', controller: 'Patienteventdefine', action: 'GetPatienteventdefine' },
    { method: 'get', path: '/Patienteventdefines', controller: 'Patienteventdefine', action: 'GetPatienteventdefines' },
    { method: 'post', path: '/Patienteventdefines', controller: 'Patienteventdefine', action: 'AddPatienteventdefine' },
    { method: 'put', path: '/Patienteventdefines', controller: 'Patienteventdefine', action: 'UpdatePatienteventdefine' },
    { method: 'delete', path: '/Patienteventdefines/:patienteventdefineId', controller: 'Patienteventdefine', action: 'DeletePatienteventdefine' },

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

    { method: 'get', path: '/Shiftdefines/:shiftdefineId', controller: 'Shiftdefine', action: 'GetShiftdefine' },
    { method: 'get', path: '/Shiftdefines', controller: 'Shiftdefine', action: 'GetShiftdefines' },
    { method: 'post', path: '/Shiftdefines', controller: 'Shiftdefine', action: 'AddShiftdefine' },
    { method: 'put', path: '/Shiftdefines', controller: 'Shiftdefine', action: 'UpdateShiftdefine' },
    { method: 'delete', path: '/Shiftdefines/:shiftdefineId', controller: 'Shiftdefine', action: 'DeleteShiftdefine' },

    { method: 'get', path: '/Personelshifts/:personelshiftId', controller: 'Personelshift', action: 'GetPersonelshift' },
    { method: 'get', path: '/Personelshifts', controller: 'Personelshift', action: 'GetPersonelshifts' },
    { method: 'post', path: '/Personelshifts/Getpeparedpersonelshift', controller: 'Personelshift', action: 'Getpeparedpersonelshift' },
    { method: 'post', path: '/Personelshifts', controller: 'Personelshift', action: 'AddPersonelshift' },
    { method: 'put', path: '/Personelshifts/Approve/:personelshiftId', controller: 'Personelshift', action: 'ApprovePersonelshift' },
    { method: 'put', path: '/Personelshifts/Complete/:personelshiftId', controller: 'Personelshift', action: 'CompletePersonelshift' },
    { method: 'put', path: '/Personelshifts/Deactive/:personelshiftId', controller: 'Personelshift', action: 'DeactivePersonelshift' },
    { method: 'put', path: '/Personelshifts', controller: 'Personelshift', action: 'UpdatePersonelshift' },
    { method: 'delete', path: '/Personelshifts/:personelshiftId', controller: 'Personelshift', action: 'DeletePersonelshift' },

    { method: 'get', path: '/Personelshiftdetails/:personelshiftdetailId', controller: 'Personelshiftdetail', action: 'GetPersonelshiftdetail' },
    { method: 'get', path: '/Personelshiftdetails', controller: 'Personelshiftdetail', action: 'GetPersonelshiftdetails' },
    { method: 'post', path: '/Personelshiftdetails', controller: 'Personelshiftdetail', action: 'AddPersonelshiftdetail' },
    { method: 'put', path: '/Personelshiftdetails', controller: 'Personelshiftdetail', action: 'UpdatePersonelshiftdetail' },
    { method: 'delete', path: '/Personelshiftdetails/:personelshiftdetailId', controller: 'Personelshiftdetail', action: 'DeletePersonelshiftdetail' },

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

    { method: 'get', path: '/Patienteventmovements/:patienteventmovementId', controller: 'Patienteventmovement', action: 'GetPatienteventmovement' },
    { method: 'get', path: '/Patienteventmovements', controller: 'Patienteventmovement', action: 'GetPatienteventmovements' },
    { method: 'post', path: '/Patienteventmovements', controller: 'Patienteventmovement', action: 'AddPatienteventmovement' },
    { method: 'put', path: '/Patienteventmovements', controller: 'Patienteventmovement', action: 'UpdatePatienteventmovement' },
    { method: 'delete', path: '/Patienteventmovements/:patienteventmovementId', controller: 'Patienteventmovement', action: 'DeletePatienteventmovement' },

    { method: 'get', path: '/Surveys/:surveyId', controller: 'Survey', action: 'GetSurvey' },
    { method: 'get', path: '/Surveys', controller: 'Survey', action: 'GetSurveys' },
    { method: 'post', path: '/Surveys/FillSurvey', controller: 'Survey', action: 'FillSurvey' },
    { method: 'post', path: '/Surveys', controller: 'Survey', action: 'AddSurvey' },
    { method: 'put', path: '/Surveys/Savepreview/:activityId', controller: 'Survey', action: 'SavepreviewSurvey' },
    { method: 'put', path: '/Surveys/Approve/:activityId', controller: 'Survey', action: 'ApproveSurvey' },
    { method: 'put', path: '/Surveys/Complete/:activityId', controller: 'Survey', action: 'CompleteSurvey' },
    { method: 'put', path: '/Surveys', controller: 'Survey', action: 'UpdateSurvey' },
    { method: 'delete', path: '/Surveys/RemoveSurveyanswer/:surveyresultId', controller: 'Survey', action: 'RemoveSurveyanswer' },
    { method: 'delete', path: '/Surveys/:surveyId', controller: 'Survey', action: 'DeleteSurvey' },

    { method: 'get', path: '/Patientactivities/:activityId', controller: 'Patientactivity', action: 'GetPatientactivity' },
    { method: 'get', path: '/Patientactivities', controller: 'Patientactivity', action: 'GetPatientactivities' },
    { method: 'post', path: '/Patientactivities', controller: 'Patientactivity', action: 'AddPatientactivity' },
    { method: 'put', path: '/Patientactivities/Savepreview/:activityId', controller: 'Patientactivity', action: 'SavepreviewPatientactivity' },
    { method: 'put', path: '/Patientactivities/Approve/:activityId', controller: 'Patientactivity', action: 'ApprovePatientactivity' },
    { method: 'put', path: '/Patientactivities/Complete/:activityId', controller: 'Patientactivity', action: 'CompletePatientactivity' },
    { method: 'put', path: '/Patientactivities', controller: 'Patientactivity', action: 'UpdatePatientactivity' },
    { method: 'delete', path: '/Patientactivities/:activityId', controller: 'Patientactivity', action: 'DeletePatientactivity' },

    { method: 'get', path: '/Patientvisits/:patientvisitId', controller: 'Patientvisit', action: 'GetPatientvisit' },
    { method: 'get', path: '/Patientvisits', controller: 'Patientvisit', action: 'GetPatientvisits' },
    { method: 'post', path: '/Patientvisits', controller: 'Patientvisit', action: 'AddPatientvisit' },
    { method: 'put', path: '/Patientvisits', controller: 'Patientvisit', action: 'UpdatePatientvisit' },
    { method: 'delete', path: '/Patientvisits/:patientvisitId', controller: 'Patientvisit', action: 'DeletePatientvisit' },

    { method: 'get', path: '/Userincidents/:userincidentId', controller: 'Userincident', action: 'GetUserincident' },
    { method: 'get', path: '/Userincidents', controller: 'Userincident', action: 'GetUserincidents' },
    { method: 'post', path: '/Userincidents', controller: 'Userincident', action: 'AddUserincident' },
    { method: 'put', path: '/Userincidents', controller: 'Userincident', action: 'UpdateUserincident' },
    { method: 'delete', path: '/Userincidents/:userincidentId', controller: 'Userincident', action: 'DeleteUserincident' },
]

module.exports = Routes