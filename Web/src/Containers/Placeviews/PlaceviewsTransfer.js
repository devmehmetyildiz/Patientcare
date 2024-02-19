import { connect } from 'react-redux'
import PlaceviewsTransfer from "../../Pages/Placeviews/PlaceviewsTransfer"
import { GetPatients, Transferpatientplace, fillPatientnotification } from "../../Redux/PatientSlice"
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

const mapDispatchToProps = { Transferpatientplace, GetCases, GetPatientdefines, GetPatients, GetFloors, GetRooms, GetBeds, fillPatientnotification }

export default connect(mapStateToProps, mapDispatchToProps)(PlaceviewsTransfer)