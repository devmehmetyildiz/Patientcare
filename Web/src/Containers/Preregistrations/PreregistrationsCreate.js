import { connect } from 'react-redux'
import PreregistrationsCreate from "../../Pages/Preregistrations/PreregistrationsCreate"
import { AddPatients, fillPatientnotification, removePatientnotification } from "../../Redux/Actions/PatientAction"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/Reducers/PatientdefineReducer"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Reducers/DepartmentReducer"
import { GetCases, removeCasenotification } from "../../Redux/Reducers/CaseReducer"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Departments: state.Departments,
  Cases: state.Cases,
  Profile: state.Profile
})

const mapDispatchToProps = {
  AddPatients, fillPatientnotification, removePatientnotification, GetPatientdefines, removePatientdefinenotification,
  GetDepartments, removeDepartmentnotification, GetCases, removeCasenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsCreate)