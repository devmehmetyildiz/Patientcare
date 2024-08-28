import { connect } from 'react-redux'
import PreregistrationsCreate from "../../Pages/Preregistrations/PreregistrationsCreate"
import { AddPatients, fillPatientnotification } from "../../Redux/PatientSlice"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Stockdefines: state.Stockdefines,
  Stocktypes: state.Stocktypes,
  Profile: state.Profile
})

const mapDispatchToProps = {
  AddPatients, fillPatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsCreate)