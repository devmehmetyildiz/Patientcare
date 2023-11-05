import { connect } from 'react-redux'
import UsersEdit from '../../Pages/Users/UsersEdit'
import { EditUsers, GetUser, handleSelectedUser, fillUsernotification } from "../../Redux/UserSlice"
import { GetRoles } from "../../Redux/RoleSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetStations } from "../../Redux/StationSlice"


const mapStateToProps = (state) => ({
  Users: state.Users,
  Roles: state.Roles,
  Departments: state.Departments,
  Stations: state.Stations,
  Profile: state.Profile
})

const mapDispatchToProps = {
  EditUsers, GetUser, handleSelectedUser, fillUsernotification, GetRoles,
  GetDepartments,  GetStations
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersEdit)