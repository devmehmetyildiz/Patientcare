import { connect } from 'react-redux'
import UsersCreate from "../../Pages/Users/UsersCreate"
import { AddUsers, fillUsernotification } from "../../Redux/UserSlice"
import { GetRoles } from "../../Redux/RoleSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetStations } from "../../Redux/StationSlice"

const mapStateToProps = (state) => ({
    Users: state.Users,
    Roles: state.Roles,
    Departments: state.Departments,
    Stations: state.Stations,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddUsers, fillUsernotification,  GetRoles,  GetDepartments,
    GetStations
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersCreate)