import { connect } from 'react-redux'
import UsersCreate from "../../Pages/Users/UsersCreate"
import { AddUsers, fillUsernotification } from "../../Redux/UserSlice"
import { GetRoles } from "../../Redux/RoleSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetProfessions } from "../../Redux/ProfessionSlice"

const mapStateToProps = (state) => ({
    Users: state.Users,
    Roles: state.Roles,
    Departments: state.Departments,
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddUsers, fillUsernotification, GetRoles, GetDepartments,
    GetProfessions
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersCreate)