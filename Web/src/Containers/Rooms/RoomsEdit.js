import { connect } from 'react-redux'
import RoomsEdit from '../../Pages/Rooms/RoomsEdit'
import { EditRooms, GetRoom, removeRoomnotification, fillRoomnotification } from "../../Redux/RoomSlice"
import { GetFloors, removeFloornotification } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Rooms: state.Rooms,
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = { EditRooms, GetRoom, removeRoomnotification, fillRoomnotification, GetFloors, removeFloornotification }

export default connect(mapStateToProps, mapDispatchToProps)(RoomsEdit)