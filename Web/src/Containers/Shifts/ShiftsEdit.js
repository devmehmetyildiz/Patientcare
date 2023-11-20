import { connect } from 'react-redux'
import ShiftsEdit from '../../Pages/Shifts/ShiftsEdit'
import { EditShifts, GetShift, fillShiftnotification } from "../../Redux/ShiftSlice"

const mapStateToProps = (state) => ({
    Shifts: state.Shifts,
    Profile: state.Profile
})

const mapDispatchToProps = { EditShifts, GetShift, fillShiftnotification }

export default connect(mapStateToProps, mapDispatchToProps)(ShiftsEdit)