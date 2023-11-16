import { connect } from 'react-redux'
import PatientsEditplace from '../../Pages/Patients/PatientsEditplace'
import { Editpatientplace, fillPatientnotification, handlePlacemodal, handleSelectedPatient } from "../../Redux/PatientSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetBeds } from "../../Redux/BedSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Floors: state.Floors,
    Rooms: state.Rooms,
    Beds: state.Beds,
    Profile: state.Profile
})

const mapDispatchToProps = {
    Editpatientplace, fillPatientnotification, handlePlacemodal, handleSelectedPatient, GetFloors, GetRooms, GetBeds
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEditplace)