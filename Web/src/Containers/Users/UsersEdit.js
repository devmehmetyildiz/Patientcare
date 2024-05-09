import { connect } from 'react-redux'
import UsersEdit from '../../Pages/Users/UsersEdit'
import { EditUsers, GetUser, handleSelectedUser, fillUsernotification } from "../../Redux/UserSlice"
import { GetRoles } from "../../Redux/RoleSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetProfessions } from "../../Redux/ProfessionSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"
import { GetFiles } from "../../Redux/FileSlice"


const mapStateToProps = (state) => ({
  Users: state.Users,
  Roles: state.Roles,
  Departments: state.Departments,
  Professions: state.Professions,
  Usagetypes: state.Usagetypes,
  Files: state.Files,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetUsagetypes, GetFiles, EditUsers, GetUser, handleSelectedUser, fillUsernotification, GetRoles,
  GetDepartments, GetProfessions
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersEdit)