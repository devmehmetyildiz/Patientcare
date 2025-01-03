import { connect } from 'react-redux'
import DepartmentsEdit from '../../Pages/Departments/DepartmentsEdit'
import { EditDepartments, GetDepartment, fillDepartmentnotification } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = { EditDepartments, GetDepartment, fillDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentsEdit)