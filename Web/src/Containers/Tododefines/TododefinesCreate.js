import { connect } from 'react-redux'
import TododefinesCreate from '../../Pages/Tododefines/TododefinesCreate'
import { AddTododefines, fillTododefinenotification } from '../../Redux/TododefineSlice'
import { GetPeriods } from '../../Redux/PeriodSlice'


const mapStateToProps = (state) => ({
    Tododefines: state.Tododefines,
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddTododefines, fillTododefinenotification,
    GetPeriods
}

export default connect(mapStateToProps, mapDispatchToProps)(TododefinesCreate)