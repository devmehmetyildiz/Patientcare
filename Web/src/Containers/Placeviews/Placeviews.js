import { connect } from 'react-redux'
import Placeviews from "../../Pages/Placeviews/Placeviews"
import { GetPatients } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetBeds } from "../../Redux/BedSlice"
import { GetCases } from "../../Redux/CaseSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Floors: state.Floors,
    Rooms: state.Rooms,
    Beds: state.Beds,
    Cases: state.Cases,
    Profile: state.Profile
})

const mapDispatchToProps = { GetCases, GetPatientdefines, GetPatients, GetFloors, GetRooms, GetBeds }

export default connect(mapStateToProps, mapDispatchToProps)(Placeviews)