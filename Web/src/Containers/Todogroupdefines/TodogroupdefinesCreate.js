import { connect } from 'react-redux'
import TodogroupdefinesCreate from '../../Pages/Todogroupdefines/TodogroupdefinesCreate'
import { GetTododefines, removeTododefinenotification } from '../../Redux/TododefineSlice'
import { AddTodogroupdefines, fillTodogroupdefinenotification, removeTodogroupdefinenotification } from '../../Redux/TodogroupdefineSlice'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/DepartmentSlice'

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