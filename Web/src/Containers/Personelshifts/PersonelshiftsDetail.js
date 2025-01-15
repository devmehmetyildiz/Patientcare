import { connect } from 'react-redux'
import PersonelshiftsDetail from "../../Pages/Personelshifts/PersonelshiftsDetail"
import { GetPersonelshift, } from "../../Redux/PersonelshiftSlice"
import { GetFloors, } from "../../Redux/FloorSlice"
import { GetUsers, } from "../../Redux/UserSlice"
import { GetProfessions, } from "../../Redux/ProfessionSlice"
import { GetShiftdefines } from '../../Redux/ShiftdefineSlice'

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Floors: state.Floors,
    Users: state.Users,
    Professions: state.Professions,
    Shiftdefines: state.Shiftdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetShiftdefines, GetPersonelshift, GetFloors, GetUsers, GetProfessions
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsDetail)