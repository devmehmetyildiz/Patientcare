import { connect } from 'react-redux'
import { AddRoles, GetAuthories, GetAuthorygroups, removeRolenotification, fillRolenotification } from "../../Redux/Actions/RoleAction"
import RolesCreate from '../../Pages/Roles/RolesCreate'

const mapStateToProps = (state) => ({
    Roles: state.Roles
})

const mapDispatchToProps = { AddRoles, GetAuthories, GetAuthorygroups, removeRolenotification, fillRolenotification }


export default connect(mapStateToProps, mapDispatchToProps)(RolesCreate)