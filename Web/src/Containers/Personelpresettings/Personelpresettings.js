import { connect } from 'react-redux'
import Personelpresettings from "../../Pages/Personelpresettings/Personelpresettings"
import { GetPersonelpresettings, handleDeletemodal, handleSelectedPersonelpresetting } from "../../Redux/PersonelpresettingSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetShifts } from "../../Redux/ShiftSlice"
import { GetUsers } from "../../Redux/UserSlice"

const mapStateToProps = (state) => ({
  Personelpresettings: state.Personelpresettings,
  Floors: state.Floors,
  Shifts: state.Shifts,
  Users: state.Users,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetPersonelpresettings, handleDeletemodal, handleSelectedPersonelpresetting,
  GetFloors, GetShifts, GetUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Personelpresettings)