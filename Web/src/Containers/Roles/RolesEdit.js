import { connect } from 'react-redux'
import RolesEdit from '../../Pages/Roles/RolesEdit'
import { GetPrivileges, GetPrivilegegroups, GetRole, EditRoles,  fillRolenotification } from "../../Redux/RoleSlice"

const mapStateToProps = (state) => ({
    Roles: state.Roles,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPrivileges, GetPrivilegegroups, GetRole, EditRoles,  fillRolenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(RolesEdit)