import { connect } from 'react-redux'
import PatientdefinesCreate from '../../Pages/Patientdefines/PatientdefinesCreate'
import { AddPatientdefines, removePatientdefinenotification, fillPatientdefinenotification } from '../../Redux/PatientdefineSlice'
import { GetCostumertypes, removeCostumertypenotification } from "../../Redux/CostumertypeSlice"
import { GetPatienttypes, removePatienttypenotification } from "../../Redux/PatienttypeSlice"

const mapStateToProps = (state) => ({
  Patientdefines: state.Patientdefines,
  Costumertypes: state.Costumertypes,
  Patienttypes: state.Patienttypes,
  Profile: state.Profile
})

const mapDispatchToProps = {
  AddPatientdefines, removePatientdefinenotification, fillPatientdefinenotification,
  GetCostumertypes, removeCostumertypenotification, GetPatienttypes, removePatienttypenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientdefinesCreate)