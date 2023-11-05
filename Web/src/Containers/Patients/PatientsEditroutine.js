import { connect } from 'react-redux'
import PatientsEditroutine from '../../Pages/Patients/PatientsEditroutine'
import { GetPatient, fillPatientnotification, Editpatienttodogroupdefine } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetTodogroupdefines } from "../../Redux/TodogroupdefineSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Todogroupdefines: state.Todogroupdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatient, GetPatientdefines, Editpatienttodogroupdefine,
    GetTodogroupdefines, fillPatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEditroutine)