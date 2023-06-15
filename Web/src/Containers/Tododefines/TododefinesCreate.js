import { connect } from 'react-redux'
import TododefinesCreate from '../../Pages/Tododefines/TododefinesCreate'
import { AddTododefines, fillTododefinenotification, removeTododefinenotification } from '../../Redux/Reducers/TododefineReducer'
import { GetPeriods, removePeriodnotification } from '../../Redux/Reducers/PeriodReducer'


const mapStateToProps = (state) => ({
    Tododefines: state.Tododefines,
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddTododefines, fillTododefinenotification, removeTododefinenotification,
    GetPeriods, removePeriodnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(TododefinesCreate)