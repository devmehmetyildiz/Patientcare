import { connect } from 'react-redux'
import TododefinesCreate from '../../Pages/Tododefines/TododefinesCreate'
import { AddTododefines, fillTododefinenotification } from '../../Redux/TododefineSlice'
import { GetCheckperiods } from '../../Redux/CheckperiodSlice'


const mapStateToProps = (state) => ({
    Tododefines: state.Tododefines,
    Checkperiods: state.Checkperiods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddTododefines, fillTododefinenotification,
    GetCheckperiods
}

export default connect(mapStateToProps, mapDispatchToProps)(TododefinesCreate)