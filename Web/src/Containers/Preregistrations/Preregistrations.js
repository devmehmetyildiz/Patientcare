import { connect } from 'react-redux'
import Preregistrations from "../../Pages/Preregistrations/Preregistrations"
import { GetPatients, handleDeletemodal, handleSelectedPatient, handleCompletemodal, handleApprovemodal, handleCheckmodal, handleDetailmodal } from "../../Redux/PatientSlice"
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetCases } from '../../Redux/CaseSlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetUsagetypes } from '../../Redux/UsagetypeSlice'
import { GetFiles } from '../../Redux/FileSlice'
import { GetFloors } from '../../Redux/FloorSlice'
import { GetRooms } from '../../Redux/RoomSlice'
import { GetBeds } from '../../Redux/BedSlice'

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Cases: state.Cases,
  Users: state.Users,
  Usagetypes: state.Usagetypes,
  Files: state.Files,
  Floors: state.Floors,
  Rooms: state.Rooms,
  Beds: state.Beds,
  Profile: state.Profile,
})

const mapDispatchToProps = {
  GetPatients, handleDeletemodal, handleSelectedPatient, handleCompletemodal, handleApprovemodal, handleCheckmodal, handleDetailmodal,
  GetPatientdefines, GetCases, GetUsers, GetUsagetypes, GetFiles, GetFloors, GetRooms, GetBeds
}

export default connect(mapStateToProps, mapDispatchToProps)(Preregistrations)