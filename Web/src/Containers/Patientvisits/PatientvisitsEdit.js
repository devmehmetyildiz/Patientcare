import { connect } from 'react-redux'
import PatientvisitsEdit from '../../Pages/Patientvisits/PatientvisitsEdit'
import { EditPatientvisits, GetPatientvisit, fillPatientvisitnotification } from '../../Redux/PatientvisitSlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetPatients } from '../../Redux/PatientSlice'

const mapStateToProps = (state) => ({
    Patientvisits: state.Patientvisits,
    Users: state.Users,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientdefines, GetPatients, EditPatientvisits, GetPatientvisit, fillPatientvisitnotification, GetUsers
}


export default connect(mapStateToProps, mapDispatchToProps)(PatientvisitsEdit)