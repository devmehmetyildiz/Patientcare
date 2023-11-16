import { connect } from 'react-redux'
import TododefinesEdit from '../../Pages/Tododefines/TododefinesEdit'
import { GetTododefine, EditTododefines, fillTododefinenotification } from '../../Redux/TododefineSlice'
import { GetPeriods } from '../../Redux/PeriodSlice'


const mapStateToProps = (state) => ({
    Tododefines: state.Tododefines,
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTododefine, EditTododefines, fillTododefinenotification,
    GetPeriods
}

export default connect(mapStateToProps, mapDispatchToProps)(TododefinesEdit)