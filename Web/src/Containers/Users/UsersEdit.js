import { connect } from 'react-redux'
import UsersEdit from '../../Pages/Users/UsersEdit'
import { EditUsers, GetUser, RemoveSelectedUser, fillUsernotification, removeUsernotification } from "../../Redux/Actions/UserAction"
import { GetRoles, removeRolenotification } from "../../Redux/Actions/RoleAction"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Actions/DepartmentAction"
import { GetStations, removeStationnotification } from "../../Redux/Actions/StationAction"


const mapStateToProps = (state) => ({
  Users: state.Users,
  Roles: state.Roles,
  Departments: state.Departments,
  Stations: state.Stations,
  Profile: state.Profile
})

const mapDispatchToProps = {
  EditUsers, GetUser, RemoveSelectedUser, fillUsernotification, removeUsernotification, GetRoles, removeRolenotification,
  GetDepartments, removeDepartmentnotification, GetStations, removeStationnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersEdit)