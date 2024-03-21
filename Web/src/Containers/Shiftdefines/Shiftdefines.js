import { connect } from 'react-redux'
import Shiftdefines from "../../Pages/Shiftdefines/Shiftdefines"
import { GetShiftdefines, DeleteShiftdefines, fillShiftdefinenotification, handleDeletemodal, handleSelectedShiftdefine } from "../../Redux/ShiftdefineSlice"

const mapStateToProps = (state) => ({
  Shiftdefines: state.Shiftdefines,
  Profile: state.Profile,
})

const mapDispatchToProps = {
  GetShiftdefines, DeleteShiftdefines, fillShiftdefinenotification, handleDeletemodal, handleSelectedShiftdefine
}

export default connect(mapStateToProps, mapDispatchToProps)(Shiftdefines)