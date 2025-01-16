import { connect } from 'react-redux'
import PatientfollowupPatientages from '../../Pages/Patientfollowup/PatientfollowupPatientages'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile,
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientfollowupPatientages)