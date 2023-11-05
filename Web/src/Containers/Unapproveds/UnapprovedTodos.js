import { connect } from 'react-redux'
import UnapprovedTodos from '../../Pages/Unapproveds/UnapprovedTodos'
import { GetTodos, removeTodonotification, ApproveTodos } from '../../Redux/TodoSlice'
import { GetTododefines, removeTododefinenotification } from '../../Redux/TododefineSlice'

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Todos: state.Todos,
    GetTododefines: state.GetTododefines,
})

const mapDispatchToProps = {
    GetTodos, removeTodonotification, ApproveTodos, GetTododefines, removeTododefinenotificationaaaaaaaaaaaaaaaaa<zzz
}


export default connect(mapStateToProps, mapDispatchToProps)(UnapprovedTodos)