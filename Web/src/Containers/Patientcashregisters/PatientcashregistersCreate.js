import { connect } from 'react-redux'
import PatientcashregistersCreate from '../../Pages/Patientcashregisters/PatientcashregistersCreate'
import { AddPatientcashregisters, fillPatientcashregisternotification } from '../../Redux/PatientcashregisterSlice'

const mapStateToProps = (state) => ({
  Patientcashregisters: state.Patientcashregisters,
  Profile: state.Profile
})

const mapDispatchToProps = { AddPatientcashregisters, fillPatientcashregisternotification }

export default connect(mapStateToProps, mapDispatchToProps)(PatientcashregistersCreate)