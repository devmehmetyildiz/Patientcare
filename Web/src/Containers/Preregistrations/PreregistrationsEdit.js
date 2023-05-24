import { connect } from 'react-redux'
import PreregistrationsEdit from "../../Pages/Preregistrations/PreregistrationsEdit"
import { GetPatient, EditPatients, fillPatientnotification, removePatientnotification } from "../../Redux/Actions/PatientAction"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Actions/DepartmentAction"
import { GetCases, removeCasenotification } from "../../Redux/Actions/CaseAction"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/Actions/PatientdefineAction"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Departments: state.Departments,
  Cases: state.Cases,
  Patientdefines: state.Patientdefines
})

const mapDispatchToProps = {
  GetPatient, EditPatients, fillPatientnotification, removePatientnotification,GetPatientdefines, removePatientdefinenotification
  , GetDepartments, removeDepartmentnotification, GetCases, removeCasenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsEdit)