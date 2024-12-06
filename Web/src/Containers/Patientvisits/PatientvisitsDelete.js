import { connect } from 'react-redux'
import PatientvisitsDelete from '../../Pages/Patientvisits/PatientvisitsDelete'
import { DeletePatientvisits, GetPatientvisits } from '../../Redux/PatientvisitSlice'

const mapStateToProps = (state) => ({
    Patientvisits: state.Patientvisits,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePatientvisits, GetPatientvisits
}


export default connect(mapStateToProps, mapDispatchToProps)(PatientvisitsDelete)