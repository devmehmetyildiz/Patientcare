import { connect } from 'react-redux'
import Placeviews from "../../Pages/Placeviews/Placeviews"
import { GetPatients, fillPatientnotification } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetBeds } from "../../Redux/BedSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetFiles } from "../../Redux/FileSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Floors: state.Floors,
    Rooms: state.Rooms,
    Beds: state.Beds,
    Cases: state.Cases,
    Files: state.Files,
    Usagetypes: state.Usagetypes,
    Profile: state.Profile
})

const mapDispatchToProps = { GetFiles, GetUsagetypes, GetCases, GetPatientdefines, GetPatients, GetFloors, GetRooms, GetBeds, fillPatientnotification }

export default connect(mapStateToProps, mapDispatchToProps)(Placeviews)