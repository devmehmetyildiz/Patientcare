import { connect } from 'react-redux'
import PreregistrationsCreate from "../../Pages/Preregistrations/PreregistrationsCreate"
import { AddPatients, fillPatientnotification, removePatientnotification } from "../../Redux/Actions/PatientAction"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/Actions/PatientdefineAction"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Actions/DepartmentAction"
import { GetCases, removeCasenotification } from "../../Redux/Actions/CaseAction"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Departments: state.Departments,
  Cases: state.Cases
})

const mapDispatchToProps = {
  AddPatients, fillPatientnotification, removePatientnotification, GetPatientdefines, removePatientdefinenotification,
  GetDepartments, removeDepartmentnotification, GetCases, removeCasenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsCreate)