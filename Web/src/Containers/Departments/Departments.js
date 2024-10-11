import { connect } from 'react-redux'
import Departments from '../../Pages/Departments/Departments'
import { GetDepartments, DeleteDepartments, fillDepartmentnotification, handleDeletemodal, handleSelectedDepartment } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetDepartments, DeleteDepartments, fillDepartmentnotification,
    handleDeletemodal, handleSelectedDepartment
}

export default connect(mapStateToProps, mapDispatchToProps)(Departments)