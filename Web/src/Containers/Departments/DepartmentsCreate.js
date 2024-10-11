import { connect } from 'react-redux'
import DepartmentsCreate from '../../Pages/Departments/DepartmentsCreate'
import { AddDepartments, fillDepartmentnotification } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = { AddDepartments, fillDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentsCreate)