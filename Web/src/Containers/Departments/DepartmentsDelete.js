import { connect } from 'react-redux'
import DepartmentsDelete from '../../Pages/Departments/DepartmentsDelete'
import { DeleteDepartments, handleDeletemodal, handleSelectedDepartment } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteDepartments, handleDeletemodal, handleSelectedDepartment
}

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentsDelete)