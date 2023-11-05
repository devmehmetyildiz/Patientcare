import { connect } from 'react-redux'
import TodogroupdefinesCreate from '../../Pages/Todogroupdefines/TodogroupdefinesCreate'
import { GetTododefines } from '../../Redux/TododefineSlice'
import { AddTodogroupdefines, fillTodogroupdefinenotification } from '../../Redux/TodogroupdefineSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
    Todogroupdefines: state.Todogroupdefines,
    Tododefines: state.Tododefines,
    Departments:state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddTodogroupdefines, fillTodogroupdefinenotification,
    GetTododefines,  GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(TodogroupdefinesCreate)