import { connect } from 'react-redux'
import Beds from "../../Pages/Beds/Beds"
import { GetBeds, DeleteBeds, handleDeletemodal, handleSelectedBed } from "../../Redux/BedSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetFloors } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
  Beds: state.Beds,
  Rooms: state.Rooms,
  Floors: state.Floors,
  Profile: state.Profile
})

const mapDispatchToProps = { GetRooms, GetFloors, GetBeds, DeleteBeds, handleDeletemodal, handleSelectedBed }

export default connect(mapStateToProps, mapDispatchToProps)(Beds)