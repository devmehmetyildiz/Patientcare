import { connect } from 'react-redux'
import FloorsEdit from '../../Pages/Floors/FloorsEdit'
import { EditFloors, GetFloor, removeFloornotification, fillFloornotification } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = { EditFloors, GetFloor, removeFloornotification, fillFloornotification }

export default connect(mapStateToProps, mapDispatchToProps)(FloorsEdit)