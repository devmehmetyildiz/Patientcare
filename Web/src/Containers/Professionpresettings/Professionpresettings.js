import { connect } from 'react-redux'
import Professionpresettings from "../../Pages/Professionpresettings/Professionpresettings"
import { GetProfessionpresettings, handleDeletemodal, handleSelectedProfessionpresetting } from "../../Redux/ProfessionpresettingSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetShiftdefines } from "../../Redux/ShiftdefineSlice"
import { GetProfessions } from "../../Redux/ProfessionSlice"


const mapStateToProps = (state) => ({
  Professionpresettings: state.Professionpresettings,
  Floors: state.Floors,
  Shiftdefines: state.Shiftdefines,
  Professions: state.Professions,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetProfessionpresettings, handleDeletemodal, handleSelectedProfessionpresetting, GetFloors,
  GetShiftdefines, GetProfessions
}

export default connect(mapStateToProps, mapDispatchToProps)(Professionpresettings)