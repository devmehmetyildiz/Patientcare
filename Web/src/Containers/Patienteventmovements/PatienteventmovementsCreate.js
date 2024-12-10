import { connect } from 'react-redux'
import PatienteventmovementsCreate from "../../Pages/Patienteventmovements/PatienteventmovementsCreate"
import { AddPatienteventmovements, fillPatienteventmovementnotification } from "../../Redux/PatienteventmovementSlice"
import { GetPatienteventdefines } from '../../Redux/PatienteventdefineSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetFloors } from '../../Redux/FloorSlice'

const mapStateToProps = (state) => ({
    Patienteventmovements: state.Patienteventmovements,
    Patienteventdefines: state.Patienteventdefines,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Users: state.Users,
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPatienteventmovements, fillPatienteventmovementnotification, GetPatienteventdefines, GetPatients, GetPatientdefines, GetUsers, GetFloors
}

export default connect(mapStateToProps, mapDispatchToProps)(PatienteventmovementsCreate)