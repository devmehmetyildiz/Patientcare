import { connect } from 'react-redux'
import Users from "../../Pages/Users/Users"
import { GetUsers, DeleteUsers, fillUsernotification, handleDeletemodal, handleSelectedUser } from "../../Redux/UserSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetRoles } from "../../Redux/RoleSlice"
import { GetProfessions } from "../../Redux/ProfessionSlice"

const mapStateToProps = (state) => ({
    Users: state.Users,
    Roles: state.Roles,
    Departments: state.Departments,
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetUsers, DeleteUsers, fillUsernotification, handleDeletemodal, handleSelectedUser, GetRoles, GetDepartments, GetProfessions
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)