import { connect } from 'react-redux'
import Patientactivities from '../../Pages/Patientactivities/Patientactivities'
import { GetPatientactivities } from '../../Redux/PatientactivitySlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetUsers } from '../../Redux/UserSlice'

const mapStateToProps = (state) => ({
    Patientactivities: state.Patientactivities,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientactivities, GetPatientdefines, GetPatients, GetUsers
}


export default connect(mapStateToProps, mapDispatchToProps)(Patientactivities)