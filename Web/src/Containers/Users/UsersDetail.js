import { connect } from 'react-redux'
import UsersDetail from "../../Pages/Users/UsersDetail"
import { GetUser, fillUsernotification, } from "../../Redux/UserSlice"
import { GetRoles } from "../../Redux/RoleSlice"
import { GetProfessions } from "../../Redux/ProfessionSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetFiles } from "../../Redux/FileSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Users: state.Users,
    Roles: state.Roles,
    Professions: state.Professions,
    Files: state.Files,
    Cases: state.Cases,
    Usagetypes: state.Usagetypes,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetUser, fillUsernotification, GetFiles, GetDepartments,
    GetCases, GetRoles, GetProfessions, GetUsagetypes
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersDetail)