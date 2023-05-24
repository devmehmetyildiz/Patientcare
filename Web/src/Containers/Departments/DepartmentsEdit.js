import { connect } from 'react-redux'
import DepartmentsEdit from '../../Pages/Departments/DepartmentsEdit'
import { EditDepartments, GetDepartment, RemoveSelectedDepartment, removeDepartmentnotification, fillDepartmentnotification } from "../../Redux/Actions/DepartmentAction"
import { GetStations, removeStationnotification } from '../../Redux/Actions/StationAction'

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Stations: state.Stations
})

const mapDispatchToProps = { EditDepartments, GetStations, GetDepartment, RemoveSelectedDepartment, removeDepartmentnotification, fillDepartmentnotification, removeStationnotification }

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentsEdit)