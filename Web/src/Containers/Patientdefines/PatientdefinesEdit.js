import { connect } from 'react-redux'
import PatientdefinesEdit from '../../Pages/Patientdefines/PatientdefinesEdit'
import { EditPatientdefines, GetPatientdefine, RemoveSelectedPatientdefine, removePatientdefinenotification, fillPatientdefinenotification } from '../../Redux/Actions/PatientdefineAction'
import { GetCostumertypes, removeCostumertypenotification } from "../../Redux/Actions/CostumertypeAction"
import { GetPatienttypes, removePatienttypenotification } from "../../Redux/Actions/PatienttypeAction"

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