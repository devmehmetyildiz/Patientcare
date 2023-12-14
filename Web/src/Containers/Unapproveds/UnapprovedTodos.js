import { connect } from 'react-redux'
import UnapprovedTodos from '../../Pages/Unapproveds/UnapprovedTodos'
import { GetTodos, ApproveTodos, ApprovemultipleTodos, fillTodonotification } from '../../Redux/TodoSlice'
import { GetTododefines } from '../../Redux/TododefineSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetPatientmovements } from '../../Redux/PatientmovementSlice'

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Todos: state.Todos,
    Tododefines: state.Tododefines,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patientmovements: state.Patientmovements,
})

const mapDispatchToProps = {
    GetTodos, GetTododefines, GetPatients, GetPatientdefines, GetPatientmovements,
    ApproveTodos, ApprovemultipleTodos, fillTodonotification
}


export default connect(mapStateToProps, mapDispatchToProps)(UnapprovedTodos)