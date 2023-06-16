import { connect } from 'react-redux'
import TodogroupdefinesEdit from '../../Pages/Todogroupdefines/TodogroupdefinesEdit'
import { GetTododefines, removeTododefinenotification } from '../../Redux/TododefineSlice'
import { GetTodogroupdefine, EditTodogroupdefines, removeTodogroupdefinenotification, fillTodogroupdefinenotification } from '../../Redux/TodogroupdefineSlice'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
    Todogroupdefines: state.Todogroupdefines,
    Tododefines: state.Tododefines,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTodogroupdefine, EditTodogroupdefines, removeTodogroupdefinenotification
    , GetDepartments, removeDepartmentnotification, fillTodogroupdefinenotification, GetTododefines, removeTododefinenotification

}

export default connect(mapStateToProps, mapDispatchToProps)(TodogroupdefinesEdit)