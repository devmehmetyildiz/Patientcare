import { connect } from 'react-redux'
import Beds from "../../Pages/Beds/Beds"
import { GetBeds, removeBednotification, DeleteBeds, handleDeletemodal, handleSelectedBed } from "../../Redux/BedSlice"
import { GetRooms, removeRoomnotification } from "../../Redux/RoomSlice"
import { GetFloors, removeFloornotification } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
  Beds: state.Beds,
  Rooms: state.Rooms,
  Floors: state.Floors,
  Profile: state.Profile
})

const mapDispatchToProps = { GetRooms, GetFloors, removeFloornotification, removeRoomnotification, GetBeds, removeBednotification, DeleteBeds, handleDeletemodal, handleSelectedBed }

export default connect(mapStateToProps, mapDispatchToProps)(Beds)