import { connect } from 'react-redux'
import RolesEdit from '../../Pages/Roles/RolesEdit'
import { GetPrivileges, GetPrivilegegroups, GetRole, EditRoles, removeRolenotification, fillRolenotification } from "../../Redux/Actions/RoleAction"

const mapStateToProps = (state) => ({
    Roles: state.Roles,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPrivileges, GetPrivilegegroups, GetRole, EditRoles, removeRolenotification, fillRolenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(RolesEdit)