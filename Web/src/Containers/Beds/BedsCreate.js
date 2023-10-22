import { connect } from 'react-redux'
import BedsCreate from '../../Pages/Beds/BedsCreate'
import { AddBeds, removeBednotification, fillBednotification } from "../../Redux/BedSlice"
import { GetRooms, removeRoomnotification } from "../../Redux/RoomSlice"
import { GetFloors, removeFloornotification } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Beds: state.Beds,
    Rooms: state.Rooms,
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = { AddBeds, GetFloors, removeFloornotification, removeBednotification, fillBednotification, GetRooms, removeRoomnotification }

export default connect(mapStateToProps, mapDispatchToProps)(BedsCreate)