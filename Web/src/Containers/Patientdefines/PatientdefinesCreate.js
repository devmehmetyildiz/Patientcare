import { connect } from 'react-redux'
import PatientdefinesCreate from '../../Pages/Patientdefines/PatientdefinesCreate'
import { AddPatientdefines, removePatientdefinenotification, fillPatientdefinenotification } from '../../Redux/Reducers/PatientdefineReducer'
import { GetCostumertypes, removeCostumertypenotification } from "../../Redux/Reducers/CostumertypeReducer"
import { GetPatienttypes, removePatienttypenotification } from "../../Redux/Reducers/PatienttypeReducer"

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