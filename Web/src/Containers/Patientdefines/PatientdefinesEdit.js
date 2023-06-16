import { connect } from 'react-redux'
import PatientdefinesEdit from '../../Pages/Patientdefines/PatientdefinesEdit'
import { EditPatientdefines, GetPatientdefine, handleSelectedPatientdefine, removePatientdefinenotification, fillPatientdefinenotification } from '../../Redux/PatientdefineSlice'
import { GetCostumertypes, removeCostumertypenotification } from "../../Redux/CostumertypeSlice"
import { GetPatienttypes, removePatienttypenotification } from "../../Redux/PatienttypeSlice"

const mapStateToProps = (state) => ({
  Patientdefines: state.Patientdefines,
  Costumertypes: state.Costumertypes,
  Patienttypes: state.Patienttypes,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetCostumertypes, removeCostumertypenotification, GetPatienttypes, removePatienttypenotification,
  EditPatientdefines, GetPatientdefine, handleSelectedPatientdefine, removePatientdefinenotification, fillPatientdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientdefinesEdit)