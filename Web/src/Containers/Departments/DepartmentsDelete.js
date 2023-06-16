import { connect } from 'react-redux'
import DepartmentsDelete from '../../Pages/Departments/DepartmentsDelete'
import { AddDepartments, removeDepartmentnotification, fillDepartmentnotification } from "../../Redux/DepartmentSlice"
import { GetStations, removeStationnotification } from '../../Redux/StationSlice'

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Stations: state.Stations,
    Profile: state.Profile
})

const mapDispatchToProps = { AddDepartments, removeStationnotification, GetStations, removeDepartmentnotification, fillDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentsDelete)