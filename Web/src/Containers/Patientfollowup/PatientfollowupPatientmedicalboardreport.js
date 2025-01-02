import { connect } from 'react-redux'
import PatientfollowupPatientmedicalboardreport from '../../Pages/Patientfollowup/PatientfollowupPatientmedicalboardreport'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile,
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientfollowupPatientmedicalboardreport)