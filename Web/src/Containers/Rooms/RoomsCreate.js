import { connect } from 'react-redux'
import RoomsCreate from '../../Pages/Rooms/RoomsCreate'
import { AddRooms, fillRoomnotification } from "../../Redux/RoomSlice"
import { GetFloors } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Rooms: state.Rooms,
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = { AddRooms,  fillRoomnotification, GetFloors }

export default connect(mapStateToProps, mapDispatchToProps)(RoomsCreate)