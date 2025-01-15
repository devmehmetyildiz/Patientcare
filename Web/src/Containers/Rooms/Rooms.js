import { connect } from 'react-redux'
import Rooms from "../../Pages/Rooms/Rooms"
import { GetRooms, } from "../../Redux/RoomSlice"
import { GetFloors } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
  Rooms: state.Rooms,
  Profile: state.Profile,
  Floors: state.Floors
})

const mapDispatchToProps = {
  GetRooms, GetFloors
}

export default connect(mapStateToProps, mapDispatchToProps)(Rooms)