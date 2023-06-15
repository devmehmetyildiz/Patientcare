import { connect } from 'react-redux'
import UsersEdit from '../../Pages/Users/UsersEdit'
import { EditUsers, GetUser, RemoveSelectedUser, fillUsernotification, removeUsernotification } from "../../Redux/Reducers/UserReducer"
import { GetRoles, removeRolenotification } from "../../Redux/Reducers/RoleReducer"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Reducers/DepartmentReducer"
import { GetStations, removeStationnotification } from "../../Redux/Reducers/StationReducer"


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