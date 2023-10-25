import { connect } from 'react-redux'
import TodosEdit from '../../Pages/Todos/TodosEdit'
import { GetTodo, EditTodos, removeTodonotification, fillTodonotification } from '../../Redux/TodoSlice'
import { GetCheckperiods, removeCheckperiodnotification } from '../../Redux/CheckperiodSlice'


const mapStateToProps = (state) => ({
    Todos: state.Todos,
    Checkperiods: state.Checkperiods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTodo, EditTodos, removeTodonotification, fillTodonotification,
    GetCheckperiods, removeCheckperiodnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(TodosEdit)