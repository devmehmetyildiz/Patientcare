import { connect } from 'react-redux'
import PreregistrationsCreate from "../../Pages/Preregistrations/PreregistrationsCreate"
import { AddPatients, fillPatientnotification } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetCases } from "../../Redux/CaseSlice"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Departments: state.Departments,
  Cases: state.Cases,
  Profile: state.Profile
})

const mapDispatchToProps = {
  AddPatients, fillPatientnotification,  GetPatientdefines,
  GetDepartments,  GetCases
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsCreate)