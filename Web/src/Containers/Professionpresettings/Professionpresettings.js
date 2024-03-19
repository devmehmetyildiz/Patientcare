import { connect } from 'react-redux'
import Professionpresettings from "../../Pages/Professionpresettings/Professionpresettings"
import { GetProfessionpresettings, handleDeletemodal, handleSelectedProfessionpresetting } from "../../Redux/ProfessionpresettingSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetShifts } from "../../Redux/ShiftSlice"
import { GetProfessions } from "../../Redux/ProfessionSlice"


const mapStateToProps = (state) => ({
  Professionpresettings: state.Professionpresettings,
  Floors: state.Floors,
  Shifts: state.Shifts,
  Professions: state.Professions,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetProfessionpresettings, handleDeletemodal, handleSelectedProfessionpresetting, GetFloors,
  GetShifts, GetProfessions
}

export default connect(mapStateToProps, mapDispatchToProps)(Professionpresettings)