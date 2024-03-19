import { connect } from 'react-redux'
import PersonelpresettingsCreate from '../../Pages/Personelpresettings/PersonelpresettingsCreate'
import { AddPersonelpresettings, fillPersonelpresettingnotification } from "../../Redux/PersonelpresettingSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetShifts } from "../../Redux/ShiftSlice"
import { GetUsers } from "../../Redux/UserSlice"

const mapStateToProps = (state) => ({
    Personelpresettings: state.Personelpresettings,
    Floors: state.Floors,
    Shifts: state.Shifts,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPersonelpresettings, fillPersonelpresettingnotification,
    GetFloors, GetShifts, GetUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelpresettingsCreate)