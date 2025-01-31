import { connect } from 'react-redux'
import Equipments from '../../Pages/Equipments/Equipments'
import { GetEquipments } from "../../Redux/EquipmentSlice"
import { GetEquipmentgroups } from "../../Redux/EquipmentgroupSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetBeds } from "../../Redux/BedSlice"
import { GetUsers } from "../../Redux/UserSlice"

const mapStateToProps = (state) => ({
    Equipments: state.Equipments,
    Rooms: state.Rooms,
    Floors: state.Floors,
    Beds: state.Beds,
    Equipmentgroups: state.Equipmentgroups,
    Users: state.Users,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetEquipments, GetEquipmentgroups, GetRooms, GetFloors, GetBeds, GetUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Equipments)