import { connect } from 'react-redux'
import TodosDelete from '../../Pages/Todos/TodosDelete'
import { DeleteTodos, handleDeletemodal, handleSelectedTodo } from '../../Redux/TodoSlice'

const mapStateToProps = (state) => ({
    Todos: state.Todos,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteTodos, handleDeletemodal, handleSelectedTodo
}

export default connect(mapStateToProps, mapDispatchToProps)(TodosDelete)