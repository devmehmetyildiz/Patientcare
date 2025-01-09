import { connect } from 'react-redux'
import Personelpresettings from "../../Pages/Personelpresettings/Personelpresettings"
import { GetPersonelpresettings, } from "../../Redux/PersonelpresettingSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetShiftdefines } from "../../Redux/ShiftdefineSlice"
import { GetUsers } from "../../Redux/UserSlice"

const mapStateToProps = (state) => ({
  Personelpresettings: state.Personelpresettings,
  Floors: state.Floors,
  Shiftdefines: state.Shiftdefines,
  Users: state.Users,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetPersonelpresettings,
  GetFloors, GetShiftdefines, GetUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Personelpresettings)