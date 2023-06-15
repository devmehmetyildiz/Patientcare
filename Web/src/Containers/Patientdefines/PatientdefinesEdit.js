import { connect } from 'react-redux'
import PatientdefinesEdit from '../../Pages/Patientdefines/PatientdefinesEdit'
import { EditPatientdefines, GetPatientdefine, RemoveSelectedPatientdefine, removePatientdefinenotification, fillPatientdefinenotification } from '../../Redux/Reducers/PatientdefineReducer'
import { GetCostumertypes, removeCostumertypenotification } from "../../Redux/Reducers/CostumertypeReducer"
import { GetPatienttypes, removePatienttypenotification } from "../../Redux/Reducers/PatienttypeReducer"

const mapStateToProps = (state) => ({
  Patientdefines: state.Patientdefines,
  Costumertypes: state.Costumertypes,
  Patienttypes: state.Patienttypes,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetCostumertypes, removeCostumertypenotification, GetPatienttypes, removePatienttypenotification,
  EditPatientdefines, GetPatientdefine, RemoveSelectedPatientdefine, removePatientdefinenotification, fillPatientdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientdefinesEdit)