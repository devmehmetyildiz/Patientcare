import { connect } from 'react-redux'
import PatientfollowupPatientgender from '../../Pages/Patientfollowup/PatientfollowupPatientgender'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile,
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientfollowupPatientgender)