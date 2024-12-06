import { connect } from 'react-redux'
import PatientvisitsApprove from '../../Pages/Patientvisits/PatientvisitsApprove'
import { ApprovePatientvisits, GetPatientvisits } from '../../Redux/PatientvisitSlice'

const mapStateToProps = (state) => ({
    Patientvisits: state.Patientvisits,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApprovePatientvisits, GetPatientvisits
}


export default connect(mapStateToProps, mapDispatchToProps)(PatientvisitsApprove)