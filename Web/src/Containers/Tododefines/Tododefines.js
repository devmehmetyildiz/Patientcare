import { connect } from 'react-redux'
import Tododefines from '../../Pages/Tododefines/Tododefines'
import { GetTododefines,  DeleteTododefines, handleDeletemodal, handleSelectedTododefine } from '../../Redux/TododefineSlice'
import { GetPeriods } from '../../Redux/PeriodSlice'

const mapStateToProps = (state) => ({
    Tododefines: state.Tododefines,
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTododefines,  DeleteTododefines, handleDeletemodal, handleSelectedTododefine,
    GetPeriods
}


export default connect(mapStateToProps, mapDispatchToProps)(Tododefines)