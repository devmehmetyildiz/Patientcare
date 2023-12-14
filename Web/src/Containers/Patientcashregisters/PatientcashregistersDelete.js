import { connect } from 'react-redux'
import PatientcashregistersDelete from '../../Pages/Patientcashregisters/PatientcashregistersDelete'
import { DeletePatientcashregisters, handleDeletemodal, handleSelectedPatientcashregister } from '../../Redux/PatientcashregisterSlice'


const mapStateToProps = (state) => ({
    Patientcashregisters: state.Patientcashregisters,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePatientcashregisters, handleDeletemodal, handleSelectedPatientcashregister
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientcashregistersDelete)