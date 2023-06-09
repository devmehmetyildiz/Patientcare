import { connect } from 'react-redux'
import DepartmentsCreate from '../../Pages/Departments/DepartmentsCreate'
import { AddDepartments, removeDepartmentnotification, fillDepartmentnotification } from "../../Redux/Actions/DepartmentAction"
import { GetStations, removeStationnotification } from '../../Redux/Actions/StationAction'

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Stations: state.Stations,
    Profile: state.Profile
})

const mapDispatchToProps = { AddDepartments, removeStationnotification, GetStations, removeDepartmentnotification, fillDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentsCreate)