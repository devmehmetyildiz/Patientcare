import { connect } from 'react-redux'
import Patients from '../../Pages/Patients/Patients'
import { GetPatients, removePatientnotification, setPatient, handleDeletemodal, handleSelectedPatient } from "../../Redux/PatientSlice"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/PatientdefineSlice"
import { GetRooms, removeRoomnotification } from "../../Redux/RoomSlice"
import { GetBeds, removeBednotification } from "../../Redux/BedSlice"
import { GetFloors, removeFloornotification } from "../../Redux/FloorSlice"
import { GetCases, removeCasenotification } from "../../Redux/CaseSlice"
import { GetPatientstocks, removePatientstocknotification } from "../../Redux/PatientstockSlice"
import { GetFiles, removeFilenotification } from "../../Redux/FileSlice"
import { GetStockdefines, removeStockdefinenotification } from "../../Redux/StockdefineSlice"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Rooms: state.Rooms,
  Beds: state.Beds,
  Floors: state.Floors,
  Cases: state.Cases,
  Files: state.Files,
  Patientstocks: state.Patientstocks,
  Stockdefines: state.Stockdefines,
  Profile: state.Profile,
})

const mapDispatchToProps = {
  GetPatients, removePatientnotification, setPatient, handleDeletemodal, handleSelectedPatient,
  GetPatientdefines, removePatientdefinenotification, GetRooms, removeRoomnotification,
  GetBeds, removeBednotification, GetFloors, removeFloornotification, GetCases, removeCasenotification,
  GetPatientstocks, removePatientstocknotification, GetFiles, removeFilenotification,
  GetStockdefines, removeStockdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Patients)