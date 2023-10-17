import { connect } from 'react-redux'
import RoomsCreate from '../../Pages/Rooms/RoomsCreate'
import { AddRooms, removeRoomnotification, fillRoomnotification } from "../../Redux/RoomSlice"
import { GetFloors, removeFloornotification } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Rooms: state.Rooms,
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = { AddRooms, removeRoomnotification, fillRoomnotification, GetFloors, removeFloornotification }

export default connect(mapStateToProps, mapDispatchToProps)(RoomsCreate)