import { connect } from 'react-redux'
import PatientactivitiesApprove from '../../Pages/Patientactivities/PatientactivitiesApprove'
import { ApprovePatientactivities, GetPatientactivities } from '../../Redux/PatientactivitySlice'

const mapStateToProps = (state) => ({
    Patientactivities: state.Patientactivities,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApprovePatientactivities, GetPatientactivities
}


export default connect(mapStateToProps, mapDispatchToProps)(PatientactivitiesApprove)