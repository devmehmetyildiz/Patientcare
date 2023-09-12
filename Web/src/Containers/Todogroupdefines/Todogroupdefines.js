import { connect } from 'react-redux'
import Todogroupdefines from '../../Pages/Todogroupdefines/Todogroupdefines'
import { GetTodogroupdefines, removeTodogroupdefinenotification, DeleteTodogroupdefines, handleDeletemodal, handleSelectedTodogroupdefine } from '../../Redux/TodogroupdefineSlice'
import { GetTododefines, removeTododefinenotification } from '../../Redux/TododefineSlice'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
    Todogroupdefines: state.Todogroupdefines,
    Profile: state.Profile,
    Tododefines: state.Tododefines,
    Departments: state.Departments
})

const mapDispatchToProps = {
    GetTodogroupdefines, removeTodogroupdefinenotification, DeleteTodogroupdefines,
    handleDeletemodal, handleSelectedTodogroupdefine,
    GetTododefines, removeTododefinenotification, GetDepartments,
    removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Todogroupdefines)