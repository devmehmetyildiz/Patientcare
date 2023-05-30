const Routes = [
  { method: 'get', path: '/Cases/GetCompleteCase', controller: 'Case', action: 'GetCompleteCase' },
  { method: 'get', path: '/Cases/:caseId', controller: 'Case', action: 'GetCase' },
  { method: 'get', path: '/Cases', controller: 'Case', action: 'GetCases' },
  { method: 'post', path: '/Cases', controller: 'Case', action: 'AddCase' },
  { method: 'put', path: '/Cases', controller: 'Case', action: 'UpdateCase' },
  { method: 'delete', path: '/Cases', controller: 'Case', action: 'DeleteCase' },

  { method: 'get', path: '/Checkperiods/:CheckperiodId', controller: 'Checkperiod', action: 'GetCheckperiod' },
  { method: 'get', path: '/Checkperiods', controller: 'Checkperiod', action: 'GetCheckperiods' },
  { method: 'post', path: '/Checkperiods', controller: 'Checkperiod', action: 'AddCheckperiod' },
  { method: 'put', path: '/Checkperiods', controller: 'Checkperiod', action: 'UpdateCheckperiod' },
  { method: 'delete', path: '/Checkperiods', controller: 'Checkperiod', action: 'DeleteCheckperiod' },

  { method: 'get', path: '/Costumertypes/:costumertypeId', controller: 'Costumertype', action: 'GetCostumertype' },
  { method: 'get', path: '/Costumertypes', controller: 'Costumertype', action: 'GetCostumertypes' },
  { method: 'post', path: '/Costumertypes', controller: 'Costumertype', action: 'AddCostumertype' },
  { method: 'put', path: '/Costumertypes', controller: 'Costumertype', action: 'UpdateCostumertype' },
  { method: 'delete', path: '/Costumertypes', controller: 'Costumertype', action: 'DeleteCostumertype' },

  { method: 'get', path: '/Departments/:departmentId', controller: 'Department', action: 'GetDepartment' },
  { method: 'get', path: '/Departments', controller: 'Department', action: 'GetDepartments' },
  { method: 'post', path: '/Departments', controller: 'Department', action: 'AddDepartment' },
  { method: 'put', path: '/Departments', controller: 'Department', action: 'UpdateDepartment' },
  { method: 'delete', path: '/Departments', controller: 'Department', action: 'DeleteDepartment' },

  { method: 'get', path: '/Patienttypes/:patienttypeId', controller: 'Patienttype', action: 'GetPatienttype' },
  { method: 'get', path: '/Patienttypes', controller: 'Patienttype', action: 'GetPatienttypes' },
  { method: 'post', path: '/Patienttypes', controller: 'Patienttype', action: 'AddPatienttype' },
  { method: 'put', path: '/Patienttypes', controller: 'Patienttype', action: 'UpdatePatienttype' },
  { method: 'delete', path: '/Patienttypes', controller: 'Patienttype', action: 'DeletePatienttype' },

  { method: 'get', path: '/Periods/:periodId', controller: 'Period', action: 'GetPeriod' },
  { method: 'get', path: '/Periods', controller: 'Period', action: 'GetPeriods' },
  { method: 'post', path: '/Periods', controller: 'Period', action: 'AddPeriod' },
  { method: 'put', path: '/Periods', controller: 'Period', action: 'UpdatePeriod' },
  { method: 'delete', path: '/Periods', controller: 'Period', action: 'DeletePeriod' },

  { method: 'get', path: '/Stations/:stationId', controller: 'Station', action: 'GetStation' },
  { method: 'get', path: '/Stations', controller: 'Station', action: 'GetStations' },
  { method: 'post', path: '/Stations', controller: 'Station', action: 'AddStation' },
  { method: 'put', path: '/Stations', controller: 'Station', action: 'UpdateStation' },
  { method: 'delete', path: '/Stations', controller: 'Station', action: 'DeleteStation' },

  { method: 'get', path: '/Tododefines/:tododefineId', controller: 'Tododefine', action: 'GetTododefine' },
  { method: 'get', path: '/Tododefines', controller: 'Tododefine', action: 'GetTododefines' },
  { method: 'post', path: '/Tododefines', controller: 'Tododefine', action: 'AddTododefine' },
  { method: 'put', path: '/Tododefines', controller: 'Tododefine', action: 'UpdateTododefine' },
  { method: 'delete', path: '/Tododefines', controller: 'Tododefine', action: 'DeleteTododefine' },

  { method: 'get', path: '/Todogroupdefines/:todogroupdefineId', controller: 'Todogroupdefine', action: 'GetTodogroupdefine' },
  { method: 'get', path: '/Todogroupdefines', controller: 'Todogroupdefine', action: 'GetTodogroupdefines' },
  { method: 'post', path: '/Todogroupdefines', controller: 'Todogroupdefine', action: 'AddTodogroupdefine' },
  { method: 'put', path: '/Todogroupdefines', controller: 'Todogroupdefine', action: 'UpdateTodogroupdefine' },
  { method: 'delete', path: '/Todogroupdefines', controller: 'Todogroupdefine', action: 'DeleteTodogroupdefine' },

  { method: 'get', path: '/Units/:unitId', controller: 'Unit', action: 'GetUnit' },
  { method: 'get', path: '/Units', controller: 'Unit', action: 'GetUnits' },
  { method: 'post', path: '/Units', controller: 'Unit', action: 'AddUnit' },
  { method: 'put', path: '/Units', controller: 'Unit', action: 'UpdateUnit' },
  { method: 'delete', path: '/Units', controller: 'Unit', action: 'DeleteUnit' },

]

module.exports = Routes