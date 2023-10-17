import { connect } from 'react-redux'
import FloorsCreate from '../../Pages/Floors/FloorsCreate'
import { AddFloors, removeFloornotification, fillFloornotification } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = { AddFloors, removeFloornotification, fillFloornotification }

export default connect(mapStateToProps, mapDispatchToProps)(FloorsCreate)