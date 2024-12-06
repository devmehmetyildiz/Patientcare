import { connect } from 'react-redux'
import PatientactivitiesSavepreview from '../../Pages/Patientactivities/PatientactivitiesSavepreview'
import { SavepreviewPatientactivities, GetPatientactivities } from '../../Redux/PatientactivitySlice'

const mapStateToProps = (state) => ({
    Patientactivities: state.Patientactivities,
    Profile: state.Profile
})

const mapDispatchToProps = {
    SavepreviewPatientactivities, GetPatientactivities
}


export default connect(mapStateToProps, mapDispatchToProps)(PatientactivitiesSavepreview)