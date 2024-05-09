import { connect } from 'react-redux'
import UsersCreate from "../../Pages/Users/UsersCreate"
import { AddUsers, fillUsernotification } from "../../Redux/UserSlice"
import { GetRoles } from "../../Redux/RoleSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetProfessions } from "../../Redux/ProfessionSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"

const mapStateToProps = (state) => ({
    Users: state.Users,
    Roles: state.Roles,
    Departments: state.Departments,
    Usagetypes: state.Usagetypes,
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddUsers, fillUsernotification, GetRoles, GetDepartments,
    GetProfessions, GetUsagetypes
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersCreate)