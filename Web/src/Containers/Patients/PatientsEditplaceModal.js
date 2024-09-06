import { connect } from 'react-redux'
import PatientsEditplaceModal from '../../Pages/Patients/PatientsEditplaceModal'
import { Editpatientplace, fillPatientnotification, GetPatient, GetPatients } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetBeds } from "../../Redux/BedSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Floors: state.Floors,
    Rooms: state.Rooms,
    Beds: state.Beds,
    Profile: state.Profile
})

const mapDispatchToProps = {
    Editpatientplace, fillPatientnotification, GetPatient, GetPatients, GetPatientdefines,
    GetFloors, GetRooms, GetBeds
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEditplaceModal)