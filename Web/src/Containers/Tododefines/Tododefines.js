import { connect } from 'react-redux'
import Tododefines from '../../Pages/Tododefines/Tododefines'
import { GetTododefines,  DeleteTododefines, handleDeletemodal, handleSelectedTododefine } from '../../Redux/TododefineSlice'
import { GetCheckperiods } from '../../Redux/CheckperiodSlice'

const mapStateToProps = (state) => ({
    Tododefines: state.Tododefines,
    Checkperiods: state.Checkperiods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTododefines,  DeleteTododefines, handleDeletemodal, handleSelectedTododefine,
    GetCheckperiods
}


export default connect(mapStateToProps, mapDispatchToProps)(Tododefines)