import { connect } from 'react-redux'
import TodogroupdefinesCreate from '../../Pages/Todogroupdefines/TodogroupdefinesCreate'
import { GetTododefines, removeTododefinenotification } from '../../Redux/Reducers/TododefineReducer'
import { AddTodogroupdefines, fillTodogroupdefinenotification, removeTodogroupdefinenotification } from '../../Redux/Reducers/TodogroupdefineReducer'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/Reducers/DepartmentReducer'

const mapStateToProps = (state) => ({
    Todogroupdefines: state.Todogroupdefines,
    Tododefines: state.Tododefines,
    Departments:state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddTodogroupdefines, fillTodogroupdefinenotification, removeTodogroupdefinenotification,
    GetTododefines, removeTododefinenotification, GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(TodogroupdefinesCreate)