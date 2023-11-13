import { connect } from 'react-redux'
import Users from "../../Pages/Users/Users"
import { GetUsers, DeleteUsers, fillUsernotification, handleDeletemodal, handleSelectedUser } from "../../Redux/UserSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetStations } from "../../Redux/StationSlice"
import { GetRoles } from "../../Redux/RoleSlice"

const mapStateToProps = (state) => ({
    Users: state.Users,
    Roles: state.Roles,
    Stations: state.Stations,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetUsers, DeleteUsers, fillUsernotification, handleDeletemodal, handleSelectedUser, GetRoles, GetDepartments, GetStations

}

export default connect(mapStateToProps, mapDispatchToProps)(Users)