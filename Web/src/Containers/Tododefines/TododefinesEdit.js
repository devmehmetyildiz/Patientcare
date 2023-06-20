import { connect } from 'react-redux'
import TododefinesEdit from '../../Pages/Tododefines/TododefinesEdit'
import { GetTododefine, EditTododefines, removeTododefinenotification, fillTododefinenotification } from '../../Redux/TododefineSlice'
import { GetCheckperiods, removeCheckperiodnotification } from '../../Redux/CheckperiodSlice'


const mapStateToProps = (state) => ({
    Tododefines: state.Tododefines,
    Checkperiods: state.Checkperiods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTododefine, EditTododefines, removeTododefinenotification, fillTododefinenotification,
    GetCheckperiods, removeCheckperiodnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(TododefinesEdit)