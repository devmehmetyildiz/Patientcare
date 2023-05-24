import { connect } from 'react-redux'
import TodogroupdefinesCreate from '../../Pages/Todogroupdefines/TodogroupdefinesCreate'
import { GetTododefines, removeTododefinenotification } from '../../Redux/Actions/TododefineAction'
import { AddTodogroupdefines, fillTodogroupdefinenotification, removeTodogroupdefinenotification } from '../../Redux/Actions/TodogroupdefineAction'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/Actions/DepartmentAction'

const mapStateToProps = (state) => ({
    Todogroupdefines: state.Todogroupdefines,
    Tododefines: state.Tododefines,
    Departments:state.Departments
})

const mapDispatchToProps = {
    AddTodogroupdefines, fillTodogroupdefinenotification, removeTodogroupdefinenotification,
    GetTododefines, removeTododefinenotification, GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(TodogroupdefinesCreate)