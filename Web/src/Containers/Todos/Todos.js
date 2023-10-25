import { connect } from 'react-redux'
import Todos from '../../Pages/Todos/Todos'
import { GetTodos, removeTodonotification, handleApprovemodal, handleSelectedTodo } from '../../Redux/TodoSlice'
import { GetPatientmovements, removePatientmovementnotification } from '../../Redux/PatientmovementSlice'
import { GetTododefines, removeTododefinenotification } from '../../Redux/TododefineSlice'
import { GetPatients, removePatientnotification } from '../../Redux/PatientSlice'
import { GetPatientdefines, removePatientdefinenotification } from '../../Redux/PatientdefineSlice'

const mapStateToProps = (state) => ({
    Todos: state.Todos,
    Patientmovements: state.Patientmovements,
    Tododefines: state.Tododefines,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTodos, removeTodonotification, handleSelectedTodo,
    GetPatientmovements, removePatientmovementnotification, GetTododefines, removeTododefinenotification,
    GetPatients, removePatientnotification, GetPatientdefines, removePatientdefinenotification, handleApprovemodal
}


export default connect(mapStateToProps, mapDispatchToProps)(Todos)