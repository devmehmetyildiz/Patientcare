import { connect } from 'react-redux'
import Todogroupdefines from '../../Pages/Todogroupdefines/Todogroupdefines'
import { GetTodogroupdefines,  DeleteTodogroupdefines, handleDeletemodal, handleSelectedTodogroupdefine } from '../../Redux/TodogroupdefineSlice'
import { GetTododefines } from '../../Redux/TododefineSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
    Todogroupdefines: state.Todogroupdefines,
    Profile: state.Profile,
    Tododefines: state.Tododefines,
    Departments: state.Departments
})

const mapDispatchToProps = {
    GetTodogroupdefines,  DeleteTodogroupdefines,
    handleDeletemodal, handleSelectedTodogroupdefine,
    GetTododefines, GetDepartments,
}

export default connect(mapStateToProps, mapDispatchToProps)(Todogroupdefines)