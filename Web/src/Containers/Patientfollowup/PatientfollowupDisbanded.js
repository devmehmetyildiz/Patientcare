import { connect } from 'react-redux'
import PatientfollowupDisbanded from '../../Pages/Patientfollowup/PatientfollowupDisbanded'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Cases: state.Cases,
    Patienttypes: state.Patienttypes,
    Profile: state.Profile,
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientfollowupDisbanded)