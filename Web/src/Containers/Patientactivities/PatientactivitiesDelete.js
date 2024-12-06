import { connect } from 'react-redux'
import PatientactivitiesDelete from '../../Pages/Patientactivities/PatientactivitiesDelete'
import { DeletePatientactivities, GetPatientactivities } from '../../Redux/PatientactivitySlice'

const mapStateToProps = (state) => ({
    Patientactivities: state.Patientactivities,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePatientactivities, GetPatientactivities
}


export default connect(mapStateToProps, mapDispatchToProps)(PatientactivitiesDelete)