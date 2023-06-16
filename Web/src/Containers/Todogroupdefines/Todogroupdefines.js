import { connect } from 'react-redux'
import Todogroupdefines from '../../Pages/Todogroupdefines/Todogroupdefines'
import { GetTodogroupdefines, removeTodogroupdefinenotification, DeleteTodogroupdefines, handleDeletemodal, handleSelectedTodogroupdefine } from '../../Redux/TodogroupdefineSlice'

const mapStateToProps = (state) => ({
    Todogroupdefines: state.Todogroupdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTodogroupdefines, removeTodogroupdefinenotification, DeleteTodogroupdefines,
    handleDeletemodal, handleSelectedTodogroupdefine
}

export default connect(mapStateToProps, mapDispatchToProps)(Todogroupdefines)