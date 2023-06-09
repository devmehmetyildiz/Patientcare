import { connect } from 'react-redux'
import { AddRoles, GetPrivileges, GetPrivilegegroups, removeRolenotification, fillRolenotification } from "../../Redux/Actions/RoleAction"
import RolesCreate from '../../Pages/Roles/RolesCreate'

const mapStateToProps = (state) => ({
    Roles: state.Roles,
    Profile: state.Profile
})

const mapDispatchToProps = { AddRoles, GetPrivileges, GetPrivilegegroups, removeRolenotification, fillRolenotification }


export default connect(mapStateToProps, mapDispatchToProps)(RolesCreate)