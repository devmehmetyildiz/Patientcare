import { connect } from 'react-redux'
import Users from "../../Pages/Users/Users"
import { GetUsers, DeleteUsers, fillUsernotification, handleDeletemodal, handleSelectedUser } from "../../Redux/UserSlice"
import { GetRoles } from "../../Redux/RoleSlice"
import { GetProfessions } from "../../Redux/ProfessionSlice"
import { GetCases } from "../../Redux/CaseSlice"

const mapStateToProps = (state) => ({
    Users: state.Users,
    Roles: state.Roles,
    Cases: state.Cases,
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetUsers, DeleteUsers, fillUsernotification, handleDeletemodal,
    GetCases, handleSelectedUser, GetRoles, GetProfessions
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)