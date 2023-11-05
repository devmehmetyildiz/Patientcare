import { connect } from 'react-redux'
import { AddRoles, GetPrivileges, GetPrivilegegroups,  fillRolenotification } from "../../Redux/RoleSlice"
import RolesCreate from '../../Pages/Roles/RolesCreate'

const mapStateToProps = (state) => ({
    Roles: state.Roles,
    Profile: state.Profile
})

const mapDispatchToProps = { AddRoles, GetPrivileges, GetPrivilegegroups,  fillRolenotification }


export default connect(mapStateToProps, mapDispatchToProps)(RolesCreate)