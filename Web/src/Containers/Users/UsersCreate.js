import { connect } from 'react-redux'
import UsersCreate from "../../Pages/Users/UsersCreate"
import { AddUsers, fillUsernotification, removeUsernotification } from "../../Redux/Reducers/UserReducer"
import { GetRoles, removeRolenotification } from "../../Redux/Reducers/RoleReducer"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Reducers/DepartmentReducer"
import { GetStations, removeStationnotification } from "../../Redux/Reducers/StationReducer"

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