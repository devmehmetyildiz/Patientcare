import { connect } from 'react-redux'
import PersonelshiftsCreate from '../../Pages/Personelshifts/PersonelshiftsCreate'
import { AddPersonelshifts, fillPersonelshiftnotification } from "../../Redux/PersonelshiftSlice"
import { GetProfessions } from "../../Redux/ProfessionSlice"
import { GetProfessionpresettings } from "../../Redux/ProfessionpresettingSlice"
import { GetPersonelpresettings } from "../../Redux/PersonelpresettingSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetShiftdefines } from "../../Redux/ShiftdefineSlice"
import { GetUsers } from "../../Redux/UserSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Professions: state.Professions,
    Professionpresettings: state.Professionpresettings,
    Personelpresettings: state.Personelpresettings,
    Floors: state.Floors,
    Shiftdefines: state.Shiftdefines,
    Users: state.Users,
    Usagetypes: state.Usagetypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPersonelshifts, fillPersonelshiftnotification, GetProfessions,
    GetProfessionpresettings, GetPersonelpresettings, GetFloors, GetShiftdefines, GetUsers, GetUsagetypes
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsCreate)