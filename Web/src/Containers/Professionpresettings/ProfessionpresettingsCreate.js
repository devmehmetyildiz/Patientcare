import { connect } from 'react-redux'
import ProfessionpresettingsCreate from '../../Pages/Professionpresettings/ProfessionpresettingsCreate'
import { AddProfessionpresettings, fillProfessionpresettingnotification } from "../../Redux/ProfessionpresettingSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetShifts } from "../../Redux/ShiftSlice"
import { GetProfessions } from "../../Redux/ProfessionSlice"

const mapStateToProps = (state) => ({
    Professionpresettings: state.Professionpresettings,
    Floors: state.Floors,
    Shifts: state.Shifts,
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddProfessionpresettings, fillProfessionpresettingnotification, GetFloors,
    GetShifts, GetProfessions
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionpresettingsCreate)