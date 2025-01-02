import { connect } from 'react-redux'
import PatientfollowupPatientcases from '../../Pages/Patientfollowup/PatientfollowupPatientcases'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile,
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientfollowupPatientcases)