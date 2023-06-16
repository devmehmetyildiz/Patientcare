import { connect } from 'react-redux'
import PreregistrationsEdit from "../../Pages/Preregistrations/PreregistrationsEdit"
import { GetPatient, EditPatients, fillPatientnotification, removePatientnotification } from "../../Redux/PatientSlice"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/DepartmentSlice"
import { GetCases, removeCasenotification } from "../../Redux/CaseSlice"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/PatientdefineSlice"

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