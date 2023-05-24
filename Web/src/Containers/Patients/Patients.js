import { connect } from 'react-redux'
import Patients from '../../Pages/Patients/Patients'
import { GetPatients, removePatientnotification, EditPatientcheckperiods, EditPatienttodogroupdefines, setPatient, RemoveSelectedPatient } from "../../Redux/Actions/PatientAction"
import { GetCheckperiods, removeCheckperiodnotification } from "../../Redux/Actions/CheckperiodAction"
import { GetTodogroupdefines, removeTodogroupdefinenotification } from "../../Redux/Actions/TodogroupdefineAction"
import { GetPrinttemplates, removePrinttemplatenotification } from "../../Redux/Actions/PrinttemplateAction"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Profile: state.Profile,
  Checkperiods: state.Checkperiods,
  Todogroupdefines: state.Todogroupdefines,
  Printtemplates: state.Printtemplates
})

const mapDispatchToProps = {
  GetPatients, removePatientnotification, GetCheckperiods, removeCheckperiodnotification,
  EditPatientcheckperiods, EditPatienttodogroupdefines, setPatient, RemoveSelectedPatient,
  GetTodogroupdefines, removeTodogroupdefinenotification, GetPrinttemplates, removePrinttemplatenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Patients)