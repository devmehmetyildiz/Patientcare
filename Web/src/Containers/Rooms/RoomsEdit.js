import { connect } from 'react-redux'
import RoomsEdit from '../../Pages/Rooms/RoomsEdit'
import { EditRooms, GetRoom,  fillRoomnotification } from "../../Redux/RoomSlice"
import { GetFloors } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Rooms: state.Rooms,
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = { EditRooms, GetRoom, fillRoomnotification, GetFloors }

export default connect(mapStateToProps, mapDispatchToProps)(RoomsEdit)