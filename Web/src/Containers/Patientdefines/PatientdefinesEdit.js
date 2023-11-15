import { connect } from 'react-redux'
import PatientdefinesEdit from '../../Pages/Patientdefines/PatientdefinesEdit'
import { EditPatientdefines, GetPatientdefine, handleSelectedPatientdefine, fillPatientdefinenotification } from '../../Redux/PatientdefineSlice'
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
  GetCostumertypes, GetPatienttypes, GetDepartments,
  EditPatientdefines, GetPatientdefine, handleSelectedPatientdefine, fillPatientdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientdefinesEdit)