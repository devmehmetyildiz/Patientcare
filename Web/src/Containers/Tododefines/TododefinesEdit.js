import { connect } from 'react-redux'
import TododefinesEdit from '../../Pages/Tododefines/TododefinesEdit'
import { GetTododefine, EditTododefines, removeTododefinenotification, fillTododefinenotification } from '../../Redux/Reducers/TododefineReducer'
import { GetPeriods, removePeriodnotification } from '../../Redux/Reducers/PeriodReducer'


const mapStateToProps = (state) => ({
    Tododefines: state.Tododefines,
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTododefine, EditTododefines, removeTododefinenotification, fillTododefinenotification,
    GetPeriods, removePeriodnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(TododefinesEdit)