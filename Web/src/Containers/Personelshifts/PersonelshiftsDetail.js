import { connect } from 'react-redux'
import PersonelshiftsDetail from '../../Pages/Personelshifts/PersonelshiftsDetail'
import { GetPersonelshifts, GetShifts, GetShiftrequest } from "../../Redux/ShiftSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetPersonels } from "../../Redux/PersonelSlice"

const mapStateToProps = (state) => ({
    Shifts: state.Shifts,
    Floors: state.Floors,
    Personels: state.Personels,
    Profile: state.Profile
})

const mapDispatchToProps = { GetShiftrequest, GetPersonelshifts, GetShifts, GetFloors, GetPersonels }

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsDetail)