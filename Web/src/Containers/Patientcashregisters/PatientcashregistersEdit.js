import { connect } from 'react-redux'
import PatientcashregistersEdit from '../../Pages/Patientcashregisters/PatientcashregistersEdit'
import { EditPatientcashregisters, GetPatientcashregister, fillPatientcashregisternotification } from '../../Redux/PatientcashregisterSlice'

const mapStateToProps = (state) => ({
  Patientcashregisters: state.Patientcashregisters,
  Profile: state.Profile
})

const mapDispatchToProps = { EditPatientcashregisters, GetPatientcashregister, fillPatientcashregisternotification }

export default connect(mapStateToProps, mapDispatchToProps)(PatientcashregistersEdit)