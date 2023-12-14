import { connect } from 'react-redux'
import Patientcashregisters from '../../Pages/Patientcashregisters/Patientcashregisters'
import { GetPatientcashregisters, handleDeletemodal, handleSelectedPatientcashregister } from '../../Redux/PatientcashregisterSlice'

const mapStateToProps = (state) => ({
  Patientcashregisters: state.Patientcashregisters,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetPatientcashregisters, handleDeletemodal, handleSelectedPatientcashregister
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientcashregisters)