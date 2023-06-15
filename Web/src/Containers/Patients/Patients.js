import { connect } from 'react-redux'
import Patients from '../../Pages/Patients/Patients'
import { GetPatients, removePatientnotification, setPatient, RemoveSelectedPatient } from "../../Redux/Reducers/PatientReducer"
import { GetCheckperiods, removeCheckperiodnotification } from "../../Redux/Reducers/CheckperiodReducer"
import { GetTodogroupdefines, removeTodogroupdefinenotification } from "../../Redux/Reducers/TodogroupdefineReducer"
import { GetPrinttemplates, removePrinttemplatenotification } from "../../Redux/Reducers/PrinttemplateReducer"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Profile: state.Profile,
  Checkperiods: state.Checkperiods,
  Todogroupdefines: state.Todogroupdefines,
  Printtemplates: state.Printtemplates
})

const mapDispatchToProps = {
  GetPatients, removePatientnotification, GetCheckperiods, removeCheckperiodnotification,
  setPatient, RemoveSelectedPatient,
  GetTodogroupdefines, removeTodogroupdefinenotification, GetPrinttemplates, removePrinttemplatenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Patients)