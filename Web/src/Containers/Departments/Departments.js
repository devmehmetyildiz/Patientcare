import { connect } from 'react-redux'
import Departments from '../../Pages/Departments/Departments'
import { GetDepartments, DeleteDepartments, removeDepartmentnotification, fillDepartmentnotification, handleDeletemodal, handleSelectedDepartment } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetDepartments, DeleteDepartments, removeDepartmentnotification, fillDepartmentnotification,
    handleDeletemodal, handleSelectedDepartment
}

export default connect(mapStateToProps, mapDispatchToProps)(Departments)