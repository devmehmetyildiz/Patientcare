import { connect } from 'react-redux'
import Patients from '../../Pages/Patients/Patients'
import { GetPatients, setPatient, handleDeletemodal, handleSelectedPatient, handleDetailmodal } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetBeds } from "../../Redux/BedSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"
import { GetFiles } from "../../Redux/FileSlice"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Rooms: state.Rooms,
  Beds: state.Beds,
  Floors: state.Floors,
  Cases: state.Cases,
  Stockdefines: state.Stockdefines,
  Usagetypes: state.Usagetypes,
  Files: state.Files,
  Profile: state.Profile,
})

const mapDispatchToProps = {
  GetPatients, setPatient, handleDeletemodal, handleSelectedPatient,
  GetPatientdefines, GetRooms,
  GetBeds, GetFloors, GetCases, GetFiles,
  GetStockdefines, GetUsagetypes, handleDetailmodal
}

export default connect(mapStateToProps, mapDispatchToProps)(Patients)