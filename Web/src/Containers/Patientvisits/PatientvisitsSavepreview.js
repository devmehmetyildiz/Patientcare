import { connect } from 'react-redux'
import PatientvisitsSavepreview from '../../Pages/Patientvisits/PatientvisitsSavepreview'
import { SavepreviewPatientvisits, GetPatientvisits } from '../../Redux/PatientvisitSlice'

const mapStateToProps = (state) => ({
    Patientvisits: state.Patientvisits,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    SavepreviewPatientvisits, GetPatientvisits
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientvisitsSavepreview)