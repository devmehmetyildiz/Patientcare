import { connect } from 'react-redux'
import Departments from '../../Pages/Departments/Departments'
import { GetDepartments, DeleteDepartments,  fillDepartmentnotification, handleDeletemodal, handleSelectedDepartment } from "../../Redux/DepartmentSlice"
import { GetStations } from "../../Redux/StationSlice"

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Profile: state.Profile,
    Stations: state.Stations
})

const mapDispatchToProps = {
    GetDepartments, DeleteDepartments,  fillDepartmentnotification,
    handleDeletemodal, handleSelectedDepartment, GetStations
}

export default connect(mapStateToProps, mapDispatchToProps)(Departments)