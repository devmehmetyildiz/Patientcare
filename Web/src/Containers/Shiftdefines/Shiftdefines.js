import { connect } from 'react-redux'
import Shiftdefines from "../../Pages/Shiftdefines/Shiftdefines"
import { GetShiftdefines } from "../../Redux/ShiftdefineSlice"

const mapStateToProps = (state) => ({
  Shiftdefines: state.Shiftdefines,
  Profile: state.Profile,
})

const mapDispatchToProps = {
  GetShiftdefines,
}

export default connect(mapStateToProps, mapDispatchToProps)(Shiftdefines)