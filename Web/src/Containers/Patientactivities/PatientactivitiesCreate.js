import { connect } from 'react-redux'
import PatientactivitiesCreate from '../../Pages/Patientactivities/PatientactivitiesCreate'
import { GetUsers } from '../../Redux/UserSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { AddPatientactivities, fillPatientactivitynotification } from '../../Redux/PatientactivitySlice'

const mapStateToProps = (state) => ({
    Patientactivities: state.Patientactivities,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetUsers, GetPatients, GetPatientdefines, AddPatientactivities, fillPatientactivitynotification
}


export default connect(mapStateToProps, mapDispatchToProps)(PatientactivitiesCreate)