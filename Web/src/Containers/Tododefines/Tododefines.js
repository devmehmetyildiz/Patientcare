import { connect } from 'react-redux'
import Tododefines from '../../Pages/Tododefines/Tododefines'
import { GetTododefines, removeTododefinenotification,DeleteTododefines } from '../../Redux/Reducers/TododefineReducer'

const mapStateToProps = (state) => ({
    Tododefines: state.Tododefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTododefines, removeTododefinenotification,DeleteTododefines
}

export default connect(mapStateToProps, mapDispatchToProps)(Tododefines)