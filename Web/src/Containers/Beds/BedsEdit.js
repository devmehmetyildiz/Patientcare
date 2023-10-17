import { connect } from 'react-redux'
import BedsEdit from '../../Pages/Beds/BedsEdit'
import { EditBeds, GetBed, removeBednotification, fillBednotification } from "../../Redux/BedSlice"
import { GetRooms, removeRoomnotification } from "../../Redux/RoomSlice"

const mapStateToProps = (state) => ({
    Beds: state.Beds,
    Rooms: state.Rooms,
    Profile: state.Profile
})

const mapDispatchToProps = { EditBeds, GetBed, removeBednotification, fillBednotification, GetRooms, removeRoomnotification }

export default connect(mapStateToProps, mapDispatchToProps)(BedsEdit)