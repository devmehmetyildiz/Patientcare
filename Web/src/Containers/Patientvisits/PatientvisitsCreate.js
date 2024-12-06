import { connect } from 'react-redux'
import PatientvisitsCreate from '../../Pages/Patientvisits/PatientvisitsCreate'
import { AddPatientvisits, fillPatientvisitnotification } from '../../Redux/PatientvisitSlice'
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
    AddPatientvisits, GetPatientdefines, GetPatients, GetUsers, fillPatientvisitnotification
}


export default connect(mapStateToProps, mapDispatchToProps)(PatientvisitsCreate)