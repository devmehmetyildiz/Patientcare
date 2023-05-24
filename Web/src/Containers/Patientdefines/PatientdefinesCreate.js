import { connect } from 'react-redux'
import PatientdefinesCreate from '../../Pages/Patientdefines/PatientdefinesCreate'
import { AddPatientdefines, removePatientdefinenotification, fillPatientdefinenotification } from '../../Redux/Actions/PatientdefineAction'
import { GetCostumertypes, removeCostumertypenotification } from "../../Redux/Actions/CostumertypeAction"
import { GetPatienttypes, removePatienttypenotification } from "../../Redux/Actions/PatienttypeAction"

const mapStateToProps = (state) => ({
  Patientdefines: state.Patientdefines,
  Costumertypes: state.Costumertypes,
  Patienttypes: state.Patienttypes,
})

const mapDispatchToProps = {
  AddPatientdefines, removePatientdefinenotification, fillPatientdefinenotification,
  GetCostumertypes, removeCostumertypenotification, GetPatienttypes, removePatienttypenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientdefinesCreate)