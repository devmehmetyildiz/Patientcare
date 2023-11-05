import { connect } from 'react-redux'
import BedsEdit from '../../Pages/Beds/BedsEdit'
import { EditBeds, GetBed,  fillBednotification } from "../../Redux/BedSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetFloors } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Beds: state.Beds,
    Rooms: state.Rooms,
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = { EditBeds, GetBed, GetFloors,   fillBednotification, GetRooms }

export default connect(mapStateToProps, mapDispatchToProps)(BedsEdit)