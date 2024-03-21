import { connect } from 'react-redux'
import ProfessionpresettingsEdit from '../../Pages/Professionpresettings/ProfessionpresettingsEdit'
import { EditProfessionpresettings, GetProfessionpresetting, fillProfessionpresettingnotification } from "../../Redux/ProfessionpresettingSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetShiftdefines } from "../../Redux/ShiftdefineSlice"
import { GetProfessions } from "../../Redux/ProfessionSlice"

const mapStateToProps = (state) => ({
    Professionpresettings: state.Professionpresettings,
    Floors: state.Floors,
    Shiftdefines: state.Shiftdefines,
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditProfessionpresettings, GetProfessionpresetting, fillProfessionpresettingnotification,
    GetFloors, GetShiftdefines, GetProfessions
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionpresettingsEdit)