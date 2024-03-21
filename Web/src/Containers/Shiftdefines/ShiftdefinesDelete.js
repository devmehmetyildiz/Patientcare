import { connect } from 'react-redux'
import ShiftdefinesDelete from "../../Pages/Shiftdefines/ShiftdefinesDelete"
import { DeleteShiftdefines, handleDeletemodal, handleSelectedShiftdefine } from "../../Redux/ShiftdefineSlice"

const mapStateToProps = (state) => ({
    Shiftdefines: state.Shiftdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteShiftdefines, handleDeletemodal, handleSelectedShiftdefine
}

export default connect(mapStateToProps, mapDispatchToProps)(ShiftdefinesDelete)