import { connect } from 'react-redux'
import PatientEventmovements from '../../Pages/Patients/PatientEventmovements'
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetPatient, DeletePatienteventmovements, EditPatienteventmovements, fillPatientnotification } from "../../Redux/PatientSlice"
import { GetPatienteventdefines } from "../../Redux/PatienteventdefineSlice"
import { GetUsers } from '../../Redux/UserSlice'
import { GetFloors } from '../../Redux/FloorSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patienteventdefines: state.Patienteventdefines,
    Users: state.Users,
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatient, DeletePatienteventmovements, EditPatienteventmovements, fillPatientnotification,
    GetPatienteventdefines, GetUsers, GetPatientdefines, GetFloors
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientEventmovements)