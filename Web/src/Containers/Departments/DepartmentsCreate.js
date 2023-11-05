import { connect } from 'react-redux'
import DepartmentsCreate from '../../Pages/Departments/DepartmentsCreate'
import { AddDepartments,  fillDepartmentnotification } from "../../Redux/DepartmentSlice"
import { GetStations } from '../../Redux/StationSlice'

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Stations: state.Stations,
    Profile: state.Profile
})

const mapDispatchToProps = { AddDepartments,  GetStations,  fillDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentsCreate)