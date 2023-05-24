import { connect } from 'react-redux'
import RolesEdit from '../../Pages/Roles/RolesEdit'
import { GetAuthories, GetAuthorygroups, GetRole, EditRoles, removeRolenotification, fillRolenotification } from "../../Redux/Actions/RoleAction"

const mapStateToProps = (state) => ({
    Roles: state.Roles
})

const mapDispatchToProps = {
    GetAuthories, GetAuthorygroups, GetRole, EditRoles, removeRolenotification, fillRolenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(RolesEdit)