import { connect } from 'react-redux'
import TodosCreate from '../../Pages/Todos/TodosCreate'
import { AddTodos, fillTodonotification, removeTodonotification } from '../../Redux/TodoSlice'
import { GetCheckperiods, removeCheckperiodnotification } from '../../Redux/CheckperiodSlice'


const mapStateToProps = (state) => ({
    Todos: state.Todos,
    Checkperiods: state.Checkperiods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddTodos, fillTodonotification, removeTodonotification,
    GetCheckperiods, removeCheckperiodnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(TodosCreate)