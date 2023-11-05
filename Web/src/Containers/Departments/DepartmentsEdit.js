import { connect } from 'react-redux'
import DepartmentsEdit from '../../Pages/Departments/DepartmentsEdit'
import { EditDepartments, GetDepartment, handleSelectedDepartment, fillDepartmentnotification } from "../../Redux/DepartmentSlice"
import { GetStations } from '../../Redux/StationSlice'

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Stations: state.Stations,
    Profile: state.Profile
})

const mapDispatchToProps = { EditDepartments, GetStations, GetDepartment, handleSelectedDepartment, fillDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentsEdit)