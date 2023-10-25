import { connect } from 'react-redux'
import TodosApprove from '../../Pages/Todos/TodosApprove'
import { ApproveTodos, handleApprovemodal, handleSelectedTodo } from '../../Redux/TodoSlice'

const mapStateToProps = (state) => ({
    Todos: state.Todos,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patientmovements: state.Patientmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApproveTodos, handleApprovemodal, handleSelectedTodo
}

export default connect(mapStateToProps, mapDispatchToProps)(TodosApprove)