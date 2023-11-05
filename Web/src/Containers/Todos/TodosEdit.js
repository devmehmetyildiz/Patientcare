import { connect } from 'react-redux'
import TodosEdit from '../../Pages/Todos/TodosEdit'
import { GetTodo, EditTodos,  fillTodonotification } from '../../Redux/TodoSlice'
import { GetCheckperiods } from '../../Redux/CheckperiodSlice'


const mapStateToProps = (state) => ({
    Todos: state.Todos,
    Checkperiods: state.Checkperiods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTodo, EditTodos,  fillTodonotification,
    GetCheckperiods
}

export default connect(mapStateToProps, mapDispatchToProps)(TodosEdit)