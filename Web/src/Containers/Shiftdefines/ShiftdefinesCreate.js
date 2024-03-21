import { connect } from 'react-redux'
import ShiftdefinesCreate from '../../Pages/Shiftdefines/ShiftdefinesCreate'
import { AddShiftdefines, fillShiftdefinenotification } from "../../Redux/ShiftdefineSlice"

const mapStateToProps = (state) => ({
    Shiftdefines: state.Shiftdefines,
    Profile: state.Profile
})

const mapDispatchToProps = { AddShiftdefines, fillShiftdefinenotification }

export default connect(mapStateToProps, mapDispatchToProps)(ShiftdefinesCreate)