import { connect } from 'react-redux'
import ShiftsCreate from '../../Pages/Shifts/ShiftsCreate'
import { AddShifts, fillShiftnotification } from "../../Redux/ShiftSlice"

const mapStateToProps = (state) => ({
    Shifts: state.Shifts,
    Profile: state.Profile
})

const mapDispatchToProps = { AddShifts, fillShiftnotification }

export default connect(mapStateToProps, mapDispatchToProps)(ShiftsCreate)