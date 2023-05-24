import { connect } from 'react-redux'
import TodogroupdefinesEdit from '../../Pages/Todogroupdefines/TodogroupdefinesEdit'
import { GetTododefines, removeTododefinenotification } from '../../Redux/Actions/TododefineAction'
import { GetTodogroupdefine, EditTodogroupdefines, removeTodogroupdefinenotification, fillTodogroupdefinenotification } from '../../Redux/Actions/TodogroupdefineAction'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/Actions/DepartmentAction'

const mapStateToProps = (state) => ({
    Todogroupdefines: state.Todogroupdefines,
    Tododefines: state.Tododefines,
    Departments: state.Departments
})

const mapDispatchToProps = {
    GetTodogroupdefine, EditTodogroupdefines, removeTodogroupdefinenotification
    , GetDepartments, removeDepartmentnotification, fillTodogroupdefinenotification, GetTododefines, removeTododefinenotification

}

export default connect(mapStateToProps, mapDispatchToProps)(TodogroupdefinesEdit)