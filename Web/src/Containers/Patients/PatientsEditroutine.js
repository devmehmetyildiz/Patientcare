import { connect } from 'react-redux'
import PatientsEditroutine from '../../Pages/Patients/PatientsEditroutine'
import { GetPatient, fillPatientnotification, UpdatePatienttododefines } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetTododefines } from "../../Redux/TododefineSlice"
import { GetTodogroupdefines, AddTodogroupdefines } from "../../Redux/TodogroupdefineSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetPeriods } from "../../Redux/PeriodSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Todogroupdefines: state.Todogroupdefines,
    Tododefines: state.Tododefines,
    Departments: state.Departments,
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatient, GetPatientdefines, UpdatePatienttododefines, AddTodogroupdefines,
    GetTodogroupdefines, fillPatientnotification, GetTododefines, GetPeriods, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEditroutine)