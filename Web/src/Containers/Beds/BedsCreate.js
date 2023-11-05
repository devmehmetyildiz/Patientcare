import { connect } from 'react-redux'
import BedsCreate from '../../Pages/Beds/BedsCreate'
import { AddBeds, fillBednotification } from "../../Redux/BedSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetFloors } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Beds: state.Beds,
    Rooms: state.Rooms,
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = { AddBeds, GetFloors, fillBednotification, GetRooms }

export default connect(mapStateToProps, mapDispatchToProps)(BedsCreate)