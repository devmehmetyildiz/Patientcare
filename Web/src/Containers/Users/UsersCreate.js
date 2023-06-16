import { connect } from 'react-redux'
import UsersCreate from "../../Pages/Users/UsersCreate"
import { AddUsers, fillUsernotification, removeUsernotification } from "../../Redux/UserSlice"
import { GetRoles, removeRolenotification } from "../../Redux/RoleSlice"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/DepartmentSlice"
import { GetStations, removeStationnotification } from "../../Redux/StationSlice"

const mapStateToProps = (state) => ({
    Users: state.Users,
    Roles: state.Roles,
    Departments: state.Departments,
    Stations: state.Stations,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddUsers, fillUsernotification, removeUsernotification, GetRoles, removeRolenotification, GetDepartments, removeDepartmentnotification,
    GetStations, removeStationnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersCreate)