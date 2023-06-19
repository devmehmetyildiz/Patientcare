import { connect } from 'react-redux'
import RolesDelete from "../../Pages/Roles/RolesDelete"
import { DeleteRoles, handleDeletemodal, handleSelectedRole } from "../../Redux/RoleSlice"

const mapStateToProps = (state) => ({
    Roles: state.Roles,
    Profile: state.Profile
})

const mapDispatchToProps = { DeleteRoles, handleDeletemodal, handleSelectedRole }

export default connect(mapStateToProps, mapDispatchToProps)(RolesDelete)