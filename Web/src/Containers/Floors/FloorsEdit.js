import { connect } from 'react-redux'
import FloorsEdit from '../../Pages/Floors/FloorsEdit'
import { EditFloors, GetFloor, fillFloornotification } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = { EditFloors, GetFloor, fillFloornotification }

export default connect(mapStateToProps, mapDispatchToProps)(FloorsEdit)