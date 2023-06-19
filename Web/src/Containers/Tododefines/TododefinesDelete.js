import { connect } from 'react-redux'
import TododefinesDelete from '../../Pages/Tododefines/TododefinesDelete'
import { DeleteTododefines, handleDeletemodal, handleSelectedTododefine } from '../../Redux/TododefineSlice'

const mapStateToProps = (state) => ({
    Tododefines: state.Tododefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteTododefines, handleDeletemodal, handleSelectedTododefine
}

export default connect(mapStateToProps, mapDispatchToProps)(TododefinesDelete)