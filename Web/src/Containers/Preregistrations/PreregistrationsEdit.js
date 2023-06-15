import { connect } from 'react-redux'
import PreregistrationsEdit from "../../Pages/Preregistrations/PreregistrationsEdit"
import { GetPatient, EditPatients, fillPatientnotification, removePatientnotification } from "../../Redux/Reducers/PatientReducer"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Reducers/DepartmentReducer"
import { GetCases, removeCasenotification } from "../../Redux/Reducers/CaseReducer"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/Reducers/PatientdefineReducer"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Departments: state.Departments,
  Cases: state.Cases,
  Patientdefines: state.Patientdefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetPatient, EditPatients, fillPatientnotification, removePatientnotification,GetPatientdefines, removePatientdefinenotification
  , GetDepartments, removeDepartmentnotification, GetCases, removeCasenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsEdit)