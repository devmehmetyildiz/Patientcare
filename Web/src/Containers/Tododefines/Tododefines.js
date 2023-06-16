import { connect } from 'react-redux'
import Tododefines from '../../Pages/Tododefines/Tododefines'
import { GetTododefines, removeTododefinenotification,DeleteTododefines,handleDeletemodal,handleSelectedTododefine } from '../../Redux/TododefineSlice'

const mapStateToProps = (state) => ({
    Tododefines: state.Tododefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTododefines, removeTododefinenotification,DeleteTododefines,handleDeletemodal,handleSelectedTododefine
}

export default connect(mapStateToProps, mapDispatchToProps)(Tododefines)