import { connect } from 'react-redux'
import Patients from '../../Pages/Patients/Patients'
import { GetPatients, setPatient, handleDeletemodal, handleSelectedPatient } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetBeds } from "../../Redux/BedSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetPatientstocks } from "../../Redux/PatientstockSlice"
import { GetFiles } from "../../Redux/FileSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"

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
  Usagetypes: state.Usagetypes,
  Profile: state.Profile,
})

const mapDispatchToProps = {
  GetPatients, setPatient, handleDeletemodal, handleSelectedPatient,
  GetPatientdefines, GetRooms,
  GetBeds, GetFloors, GetCases,
  GetPatientstocks, GetFiles,
  GetStockdefines, GetUsagetypes
}

export default connect(mapStateToProps, mapDispatchToProps)(Patients)