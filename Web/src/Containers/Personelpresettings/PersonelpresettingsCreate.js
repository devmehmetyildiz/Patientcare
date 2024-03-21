import { connect } from 'react-redux'
import PersonelpresettingsCreate from '../../Pages/Personelpresettings/PersonelpresettingsCreate'
import { AddPersonelpresettings, fillPersonelpresettingnotification } from "../../Redux/PersonelpresettingSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetShiftdefines } from "../../Redux/ShiftdefineSlice"
import { GetUsers } from "../../Redux/UserSlice"

const mapStateToProps = (state) => ({
    Personelpresettings: state.Personelpresettings,
    Floors: state.Floors,
    Shiftdefines: state.Shiftdefines,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPersonelpresettings, fillPersonelpresettingnotification,
    GetFloors, GetShiftdefines, GetUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelpresettingsCreate)