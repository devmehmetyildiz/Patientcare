import { connect } from 'react-redux'
import PatientdefinesCreate from '../../Pages/Patientdefines/PatientdefinesCreate'
import { AddPatientdefines, fillPatientdefinenotification } from '../../Redux/PatientdefineSlice'
import { GetCostumertypes } from "../../Redux/CostumertypeSlice"
import { GetPatienttypes } from "../../Redux/PatienttypeSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
  Patientdefines: state.Patientdefines,
  Costumertypes: state.Costumertypes,
  Patienttypes: state.Patienttypes,
  Departments: state.Departments,
  Profile: state.Profile
})

const mapDispatchToProps = {
  AddPatientdefines, fillPatientdefinenotification,
  GetCostumertypes, GetPatienttypes, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientdefinesCreate)