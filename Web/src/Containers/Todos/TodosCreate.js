import { connect } from 'react-redux'
import TodosCreate from '../../Pages/Todos/TodosCreate'
import { AddTodos, fillTodonotification } from '../../Redux/TodoSlice'
import { GetCheckperiods } from '../../Redux/CheckperiodSlice'


const mapStateToProps = (state) => ({
    Todos: state.Todos,
    Checkperiods: state.Checkperiods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddTodos, fillTodonotification,
    GetCheckperiods
}

export default connect(mapStateToProps, mapDispatchToProps)(TodosCreate)