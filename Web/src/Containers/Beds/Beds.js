import { connect } from 'react-redux'
import Beds from "../../Pages/Beds/Beds"
import { GetBeds,ChangeBedOccupied, handleDeletemodal, handleSelectedBed } from "../../Redux/BedSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetPatients } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"

const mapStateToProps = (state) => ({
  Beds: state.Beds,
  Rooms: state.Rooms,
  Floors: state.Floors,
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetRooms, GetFloors, GetBeds,
  ChangeBedOccupied, handleDeletemodal, handleSelectedBed, GetPatientdefines, GetPatients
}

export default connect(mapStateToProps, mapDispatchToProps)(Beds)