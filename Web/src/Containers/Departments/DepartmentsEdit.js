import { connect } from 'react-redux'
import DepartmentsEdit from '../../Pages/Departments/DepartmentsEdit'
import { EditDepartments, GetDepartment, RemoveSelectedDepartment, removeDepartmentnotification, fillDepartmentnotification } from "../../Redux/DepartmentSlice"
import { GetStations, removeStationnotification } from '../../Redux/StationSlice'

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Stations: state.Stations,
    Profile: state.Profile
})

const mapDispatchToProps = { EditDepartments, GetStations, GetDepartment, RemoveSelectedDepartment, removeDepartmentnotification, fillDepartmentnotification, removeStationnotification }

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentsEdit)