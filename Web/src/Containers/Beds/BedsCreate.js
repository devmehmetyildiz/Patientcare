import { connect } from 'react-redux'
import BedsCreate from '../../Pages/Beds/BedsCreate'
import { AddBeds, removeBednotification, fillBednotification } from "../../Redux/BedSlice"
import { GetRooms, removeRoomnotification } from "../../Redux/RoomSlice"

const mapStateToProps = (state) => ({
    Beds: state.Beds,
    Rooms: state.Rooms,
    Profile: state.Profile
})

const mapDispatchToProps = { AddBeds, removeBednotification, fillBednotification, GetRooms, removeRoomnotification }

export default connect(mapStateToProps, mapDispatchToProps)(BedsCreate)