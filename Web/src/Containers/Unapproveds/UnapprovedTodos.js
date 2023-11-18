import { connect } from 'react-redux'
import UnapprovedTodos from '../../Pages/Unapproveds/UnapprovedTodos'
import { GetTodos, ApproveTodos } from '../../Redux/TodoSlice'
import { GetTododefines } from '../../Redux/TododefineSlice'

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Todos: state.Todos,
    GetTododefines: state.GetTododefines,
})

const mapDispatchToProps = {
    GetTodos, ApproveTodos, GetTododefines
}


export default connect(mapStateToProps, mapDispatchToProps)(UnapprovedTodos)