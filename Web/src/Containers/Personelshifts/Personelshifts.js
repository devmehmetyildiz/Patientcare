import { connect } from 'react-redux'
import Personelshifts from "../../Pages/Personelshifts/Personelshifts"
import { GetShiftrequests } from "../../Redux/ShiftSlice"

const mapStateToProps = (state) => ({
  Shifts: state.Shifts,
  Profile: state.Profile
})

const mapDispatchToProps = { GetShiftrequests }

export default connect(mapStateToProps, mapDispatchToProps)(Personelshifts)