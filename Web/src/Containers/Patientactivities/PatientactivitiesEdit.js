import { connect } from 'react-redux'
import PatientactivitiesEdit from '../../Pages/Patientactivities/PatientactivitiesEdit'
import { GetUsers } from '../../Redux/UserSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { EditPatientactivities, GetPatientactivity, fillPatientactivitynotification } from '../../Redux/PatientactivitySlice'

const mapStateToProps = (state) => ({
    Patientactivities: state.Patientactivities,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetUsers, GetPatients, GetPatientdefines, EditPatientactivities, GetPatientactivity, fillPatientactivitynotification
}


export default connect(mapStateToProps, mapDispatchToProps)(PatientactivitiesEdit)