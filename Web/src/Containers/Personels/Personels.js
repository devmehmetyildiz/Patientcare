import { connect } from 'react-redux'
import Personels from "../../Pages/Personels/Personels"
import { GetPersonels, handleDeletemodal, handleSelectedPersonel, AddRecordPersonels } from "../../Redux/PersonelSlice"
import { GetShifts } from "../../Redux/ShiftSlice"
import { GetFloors } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
  Personels: state.Personels,
  Shifts: state.Shifts,
  Floors: state.Floors,
  Profile: state.Profile
})

const mapDispatchToProps = { GetPersonels, handleDeletemodal, handleSelectedPersonel, AddRecordPersonels, GetShifts, GetFloors }

export default connect(mapStateToProps, mapDispatchToProps)(Personels)