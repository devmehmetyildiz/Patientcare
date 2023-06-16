import { connect } from 'react-redux'
import PreregistrationsCreate from "../../Pages/Preregistrations/PreregistrationsCreate"
import { AddPatients, fillPatientnotification, removePatientnotification } from "../../Redux/PatientSlice"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/PatientdefineSlice"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/DepartmentSlice"
import { GetCases, removeCasenotification } from "../../Redux/CaseSlice"

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