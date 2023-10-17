import { connect } from 'react-redux'
import Beds from "../../Pages/Beds/Beds"
import { GetBeds, removeBednotification, DeleteBeds, handleDeletemodal, handleSelectedBed } from "../../Redux/BedSlice"
import { GetRooms, removeRoomnotification } from "../../Redux/RoomSlice"

const mapStateToProps = (state) => ({
  Beds: state.Beds,
  Rooms: state.Rooms,
  Profile: state.Profile
})

const mapDispatchToProps = { GetRooms, removeRoomnotification, GetBeds, removeBednotification, DeleteBeds, handleDeletemodal, handleSelectedBed }

export default connect(mapStateToProps, mapDispatchToProps)(Beds)