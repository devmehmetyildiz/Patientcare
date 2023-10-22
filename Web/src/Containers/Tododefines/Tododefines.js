import { connect } from 'react-redux'
import Tododefines from '../../Pages/Tododefines/Tododefines'
import { GetTododefines, removeTododefinenotification, DeleteTododefines, handleDeletemodal, handleSelectedTododefine } from '../../Redux/TododefineSlice'
import { GetCheckperiods, removeCheckperiodnotification } from '../../Redux/CheckperiodSlice'

const mapStateToProps = (state) => ({
    Tododefines: state.Tododefines,
    Checkperiods: state.Checkperiods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTododefines, removeTododefinenotification, DeleteTododefines, handleDeletemodal, handleSelectedTododefine,
    GetCheckperiods, removeCheckperiodnotification
}


export default connect(mapStateToProps, mapDispatchToProps)(Tododefines)