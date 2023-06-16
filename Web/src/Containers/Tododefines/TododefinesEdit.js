import { connect } from 'react-redux'
import TododefinesEdit from '../../Pages/Tododefines/TododefinesEdit'
import { GetTododefine, EditTododefines, removeTododefinenotification, fillTododefinenotification } from '../../Redux/TododefineSlice'
import { GetPeriods, removePeriodnotification } from '../../Redux/PeriodSlice'


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