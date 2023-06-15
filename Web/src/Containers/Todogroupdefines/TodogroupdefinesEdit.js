import { connect } from 'react-redux'
import TodogroupdefinesEdit from '../../Pages/Todogroupdefines/TodogroupdefinesEdit'
import { GetTododefines, removeTododefinenotification } from '../../Redux/Reducers/TododefineReducer'
import { GetTodogroupdefine, EditTodogroupdefines, removeTodogroupdefinenotification, fillTodogroupdefinenotification } from '../../Redux/Reducers/TodogroupdefineReducer'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/Reducers/DepartmentReducer'

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