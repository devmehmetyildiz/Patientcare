import { connect } from 'react-redux'
import PersonelshiftsDetail from '../../Pages/Personelshifts/PersonelshiftsDetail'
import { GetShifts } from "../../Redux/ShiftSlice"
import { GetPersonelshift } from "../../Redux/PersonelshiftSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetPersonels } from "../../Redux/PersonelSlice"

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Shifts: state.Shifts,
    Floors: state.Floors,
    Personels: state.Personels,
    Profile: state.Profile
})

const mapDispatchToProps = { GetShifts, GetFloors, GetPersonels, GetPersonelshift }

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsDetail)