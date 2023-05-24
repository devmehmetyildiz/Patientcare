import { connect } from 'react-redux'
import Roles from "../../Pages/Roles/Roles"
import { GetRoles,removeRolenotification ,DeleteRoles} from "../../Redux/Actions/RoleAction"

const mapStateToProps = (state) => ({
  Roles: state.Roles,
  Profile: state.Profile
})

const mapDispatchToProps = { GetRoles,removeRolenotification,DeleteRoles }

export default connect(mapStateToProps, mapDispatchToProps)(Roles)