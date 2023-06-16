import { connect } from 'react-redux'
import TododefinesCreate from '../../Pages/Tododefines/TododefinesCreate'
import { AddTododefines, fillTododefinenotification, removeTododefinenotification } from '../../Redux/TododefineSlice'
import { GetPeriods, removePeriodnotification } from '../../Redux/PeriodSlice'


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