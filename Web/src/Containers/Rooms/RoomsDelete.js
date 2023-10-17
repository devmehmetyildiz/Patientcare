import { connect } from 'react-redux'
import RoomsDelete from "../../Pages/Rooms/RoomsDelete"
import { DeleteRooms, handleDeletemodal, handleSelectedRoom } from "../../Redux/RoomSlice"

const mapStateToProps = (state) => ({
    Rooms: state.Rooms,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteRooms, handleDeletemodal, handleSelectedRoom
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomsDelete)