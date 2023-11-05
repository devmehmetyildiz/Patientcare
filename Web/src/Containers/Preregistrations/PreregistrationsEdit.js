import { connect } from 'react-redux'
import PreregistrationsEdit from "../../Pages/Preregistrations/PreregistrationsEdit"
import { GetPatient, EditPatients, fillPatientnotification } from "../../Redux/PatientSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Departments: state.Departments,
  Cases: state.Cases,
  Patientdefines: state.Patientdefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetPatient, EditPatients, fillPatientnotification, GetPatientdefines
  , GetDepartments, GetCases
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsEdit)