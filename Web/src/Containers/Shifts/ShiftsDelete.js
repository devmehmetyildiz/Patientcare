import { connect } from 'react-redux'
import ShiftsDelete from "../../Pages/Shifts/ShiftsDelete"
import { DeleteShifts, handleDeletemodal, handleSelectedShift } from "../../Redux/ShiftSlice"

const mapStateToProps = (state) => ({
    Shifts: state.Shifts,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteShifts, handleDeletemodal, handleSelectedShift
}

export default connect(mapStateToProps, mapDispatchToProps)(ShiftsDelete)