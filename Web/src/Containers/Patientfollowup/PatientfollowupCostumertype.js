import { connect } from 'react-redux'
import PatientfollowupCostumertype from '../../Pages/Patientfollowup/PatientfollowupCostumertype'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile,
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientfollowupCostumertype)