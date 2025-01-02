import { connect } from 'react-redux'
import PatientfollowupPatienttypes from '../../Pages/Patientfollowup/PatientfollowupPatienttypes'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile,
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientfollowupPatienttypes)