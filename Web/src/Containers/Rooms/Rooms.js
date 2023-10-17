import { connect } from 'react-redux'
import Rooms from "../../Pages/Rooms/Rooms"
import { GetRooms, DeleteRooms, removeRoomnotification, fillRoomnotification, handleDeletemodal, handleSelectedRoom } from "../../Redux/RoomSlice"
import { GetFloors, removeFloornotification } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
  Rooms: state.Rooms,
  Profile: state.Profile,
  Floors: state.Floors
})

const mapDispatchToProps = {
  GetRooms, DeleteRooms, removeRoomnotification, fillRoomnotification,
  handleDeletemodal, handleSelectedRoom, GetFloors, removeFloornotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Rooms)