import { connect } from 'react-redux'
import UsersCreate from "../../Pages/Users/UsersCreate"
import { AddUsers, fillUsernotification, removeUsernotification } from "../../Redux/Actions/UserAction"
import { GetRoles, removeRolenotification } from "../../Redux/Actions/RoleAction"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Actions/DepartmentAction"
import { GetStations, removeStationnotification } from "../../Redux/Actions/StationAction"

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