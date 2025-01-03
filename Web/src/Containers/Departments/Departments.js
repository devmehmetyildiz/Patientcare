import { connect } from 'react-redux'
import Departments from '../../Pages/Departments/Departments'
import { GetDepartments, fillDepartmentnotification, } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetDepartments, fillDepartmentnotification,
}

export default connect(mapStateToProps, mapDispatchToProps)(Departments)