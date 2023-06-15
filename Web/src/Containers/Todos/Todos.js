import { connect } from 'react-redux'
import Todos from '../../Pages/Todos/Todos'
import { GetTodos, removeTodonotification, EditTodos, fillTodonotification } from "../../Redux/Reducers/TodoReducer"

const mapStateToProps = (state) => ({
    Todos: state.Todos,
    Profile:state.Profile
})

const mapDispatchToProps = {
    GetTodos, removeTodonotification, EditTodos, fillTodonotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Todos)