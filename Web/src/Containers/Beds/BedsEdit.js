import { connect } from 'react-redux'
import BedsEdit from '../../Pages/Beds/BedsEdit'
import { EditBeds, GetBed, removeBednotification, fillBednotification } from "../../Redux/BedSlice"
import { GetRooms, removeRoomnotification } from "../../Redux/RoomSlice"
import { GetFloors, removeFloornotification } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Beds: state.Beds,
    Rooms: state.Rooms,
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = { EditBeds, GetBed, GetFloors, removeFloornotification, removeBednotification, fillBednotification, GetRooms, removeRoomnotification }

export default connect(mapStateToProps, mapDispatchToProps)(BedsEdit)