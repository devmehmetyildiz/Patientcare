import { connect } from 'react-redux'
import PatientsEditroutine from '../../Pages/Patients/PatientsEditroutine'
import { GetPatient, removePatientnotification, fillPatientnotification, Editpatienttodogroupdefine } from "../../Redux/PatientSlice"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/PatientdefineSlice"
import { GetTodogroupdefines, removeTodogroupdefinenotification } from "../../Redux/TodogroupdefineSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Todogroupdefines: state.Todogroupdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatient, removePatientnotification, GetPatientdefines, Editpatienttodogroupdefine,
    removePatientdefinenotification, GetTodogroupdefines, removeTodogroupdefinenotification, fillPatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEditroutine)