import { connect } from 'react-redux'
import Todos from '../../Pages/Todos/Todos'
import { GetTodos, handleApprovemodal, handleSelectedTodo } from '../../Redux/TodoSlice'
import { GetPatientmovements } from '../../Redux/PatientmovementSlice'
import { GetTododefines } from '../../Redux/TododefineSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'

const mapStateToProps = (state) => ({
    Todos: state.Todos,
    Patientmovements: state.Patientmovements,
    Tododefines: state.Tododefines,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTodos, handleSelectedTodo,
    GetPatientmovements, GetTododefines,
    GetPatients, GetPatientdefines, handleApprovemodal
}


export default connect(mapStateToProps, mapDispatchToProps)(Todos)