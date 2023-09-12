import { connect } from 'react-redux'
import Departments from '../../Pages/Departments/Departments'
import { GetDepartments, DeleteDepartments, removeDepartmentnotification, fillDepartmentnotification, handleDeletemodal, handleSelectedDepartment } from "../../Redux/DepartmentSlice"
import { GetStations, removeStationnotification } from "../../Redux/StationSlice"

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Profile: state.Profile,
    Stations: state.Stations
})

const mapDispatchToProps = {
    GetDepartments, DeleteDepartments, removeDepartmentnotification, fillDepartmentnotification,
    handleDeletemodal, handleSelectedDepartment, GetStations, removeStationnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Departments)