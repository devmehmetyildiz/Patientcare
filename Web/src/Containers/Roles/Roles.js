import { connect } from 'react-redux'
import Roles from "../../Pages/Roles/Roles"
import { GetRoles, removeRolenotification, DeleteRoles, handleDeletemodal, handleSelectedRole } from "../../Redux/RoleSlice"

const mapStateToProps = (state) => ({
  Roles: state.Roles,
  Profile: state.Profile
})

const mapDispatchToProps = { GetRoles, removeRolenotification, DeleteRoles, handleDeletemodal, handleSelectedRole }

export default connect(mapStateToProps, mapDispatchToProps)(Roles)