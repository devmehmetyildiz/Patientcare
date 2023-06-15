import { connect } from 'react-redux'
import Todogroupdefines from '../../Pages/Todogroupdefines/Todogroupdefines'
import { GetTodogroupdefines,removeTodogroupdefinenotification,DeleteTodogroupdefines } from '../../Redux/Reducers/TodogroupdefineReducer'

const mapStateToProps = (state) => ({
    Todogroupdefines: state.Todogroupdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {GetTodogroupdefines,removeTodogroupdefinenotification,DeleteTodogroupdefines}

export default connect(mapStateToProps, mapDispatchToProps)(Todogroupdefines)