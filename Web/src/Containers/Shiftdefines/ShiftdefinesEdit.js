import { connect } from 'react-redux'
import ShiftdefinesEdit from '../../Pages/Shiftdefines/ShiftdefinesEdit'
import { EditShiftdefines, GetShiftdefine, fillShiftdefinenotification } from "../../Redux/ShiftdefineSlice"

const mapStateToProps = (state) => ({
    Shiftdefines: state.Shiftdefines,
    Profile: state.Profile
})

const mapDispatchToProps = { EditShiftdefines, GetShiftdefine, fillShiftdefinenotification }

export default connect(mapStateToProps, mapDispatchToProps)(ShiftdefinesEdit)