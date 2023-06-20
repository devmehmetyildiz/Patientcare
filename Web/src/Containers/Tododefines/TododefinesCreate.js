import { connect } from 'react-redux'
import TododefinesCreate from '../../Pages/Tododefines/TododefinesCreate'
import { AddTododefines, fillTododefinenotification, removeTododefinenotification } from '../../Redux/TododefineSlice'
import { GetCheckperiods, removeCheckperiodnotification } from '../../Redux/CheckperiodSlice'


const mapStateToProps = (state) => ({
    Tododefines: state.Tododefines,
    Checkperiods: state.Checkperiods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddTododefines, fillTododefinenotification, removeTododefinenotification,
    GetCheckperiods, removeCheckperiodnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(TododefinesCreate)