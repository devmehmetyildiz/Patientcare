import { connect } from 'react-redux'
import PatientvisitsComplete from '../../Pages/Patientvisits/PatientvisitsComplete'
import { CompletePatientvisits, GetPatientvisits } from '../../Redux/PatientvisitSlice'

const mapStateToProps = (state) => ({
    Patientvisits: state.Patientvisits,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    CompletePatientvisits, GetPatientvisits
}


export default connect(mapStateToProps, mapDispatchToProps)(PatientvisitsComplete)