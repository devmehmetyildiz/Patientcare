import { connect } from 'react-redux'
import Departments from '../../Pages/Departments/Departments'
import { GetDepartments, DeleteDepartments, removeDepartmentnotification, fillDepartmentnotification } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = { GetDepartments, DeleteDepartments, removeDepartmentnotification, fillDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(Departments)