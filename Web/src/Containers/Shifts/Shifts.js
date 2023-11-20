import { connect } from 'react-redux'
import Shifts from "../../Pages/Shifts/Shifts"
import { GetShifts, DeleteShifts, fillShiftnotification, handleDeletemodal, handleSelectedShift } from "../../Redux/ShiftSlice"

const mapStateToProps = (state) => ({
  Shifts: state.Shifts,
  Profile: state.Profile,
})

const mapDispatchToProps = {
  GetShifts, DeleteShifts, fillShiftnotification, handleDeletemodal, handleSelectedShift
}

export default connect(mapStateToProps, mapDispatchToProps)(Shifts)