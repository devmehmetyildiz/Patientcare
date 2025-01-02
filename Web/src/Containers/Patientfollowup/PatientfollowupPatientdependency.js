import { connect } from 'react-redux'
import PatientfollowupPatientdependency from '../../Pages/Patientfollowup/PatientfollowupPatientdependency'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile,
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientfollowupPatientdependency)