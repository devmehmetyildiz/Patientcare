import { connect } from 'react-redux'
import ProfessionpresettingsEdit from '../../Pages/Professionpresettings/ProfessionpresettingsEdit'
import { EditProfessionpresettings, GetProfessionpresetting, fillProfessionpresettingnotification } from "../../Redux/ProfessionpresettingSlice"
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
    EditProfessionpresettings, GetProfessionpresetting, fillProfessionpresettingnotification,
    GetFloors, GetShifts, GetProfessions
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionpresettingsEdit)