import { connect } from 'react-redux'
import TododefinesCreate from '../../Pages/Tododefines/TododefinesCreate'
import { AddTododefines, fillTododefinenotification, removeTododefinenotification } from '../../Redux/Actions/TododefineAction'
import { GetPeriods, removePeriodnotification } from '../../Redux/Actions/PeriodAction'


const mapStateToProps = (state) => ({
    Tododefines: state.Tododefines,
    Periods: state.Periods
})

const mapDispatchToProps = {
    AddTododefines, fillTododefinenotification, removeTododefinenotification,
    GetPeriods, removePeriodnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(TododefinesCreate)