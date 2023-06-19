import { connect } from 'react-redux'
import TodogroupdefinesDelete from '../../Pages/Todogroupdefines/TodogroupdefinesDelete'
import { DeleteTodogroupdefines, handleDeletemodal, handleSelectedTodogroupdefine } from '../../Redux/TodogroupdefineSlice'

const mapStateToProps = (state) => ({
    Todogroupdefines: state.Todogroupdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteTodogroupdefines, handleDeletemodal, handleSelectedTodogroupdefine
}

export default connect(mapStateToProps, mapDispatchToProps)(TodogroupdefinesDelete)