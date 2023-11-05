import { connect } from 'react-redux'
import TodogroupdefinesEdit from '../../Pages/Todogroupdefines/TodogroupdefinesEdit'
import { GetTododefines } from '../../Redux/TododefineSlice'
import { GetTodogroupdefine, EditTodogroupdefines,  fillTodogroupdefinenotification } from '../../Redux/TodogroupdefineSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
    Todogroupdefines: state.Todogroupdefines,
    Tododefines: state.Tododefines,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTodogroupdefine, EditTodogroupdefines
    , GetDepartments,  fillTodogroupdefinenotification, GetTododefines

}

export default connect(mapStateToProps, mapDispatchToProps)(TodogroupdefinesEdit)