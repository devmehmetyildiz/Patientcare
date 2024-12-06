import { connect } from 'react-redux'
import PatientactivitiesComplete from '../../Pages/Patientactivities/PatientactivitiesComplete'
import { CompletePatientactivities, GetPatientactivities } from '../../Redux/PatientactivitySlice'

const mapStateToProps = (state) => ({
    Patientactivities: state.Patientactivities,
    Profile: state.Profile
})

const mapDispatchToProps = {
    CompletePatientactivities, GetPatientactivities
}


export default connect(mapStateToProps, mapDispatchToProps)(PatientactivitiesComplete)