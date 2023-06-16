import { connect } from 'react-redux'
import Patients from '../../Pages/Patients/Patients'
import { GetPatients, removePatientnotification, setPatient, RemoveSelectedPatient } from "../../Redux/PatientSlice"
import { GetCheckperiods, removeCheckperiodnotification } from "../../Redux/CheckperiodSlice"
import { GetTodogroupdefines, removeTodogroupdefinenotification } from "../../Redux/TodogroupdefineSlice"
import { GetPrinttemplates, removePrinttemplatenotification } from "../../Redux/PrinttemplateSlice"

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