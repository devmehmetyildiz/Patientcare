import { connect } from 'react-redux'
import Preregistrations from "../../Pages/Preregistrations/Preregistrations"
import { GetPatients, CompletePrepatients, DeletePatients, fillPatientnotification, handleDeletemodal, handleSelectedPatient, handleCompletemodal } from "../../Redux/PatientSlice"
import { GetWarehouses } from "../../Redux/WarehouseSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetBeds } from "../../Redux/BedSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetFiles } from "../../Redux/FileSlice"
import { GetPatientstocks } from "../../Redux/PatientstockSlice"
import { GetPatientstockmovements } from "../../Redux/PatientstockmovementSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Profile: state.Profile,
  Files: state.Files,
  Patientdefines: state.Patientdefines,
  Patientstocks: state.Patientstocks,
  Patientstockmovements: state.Patientstockmovements,
  Stockdefines: state.Stockdefines,
  Cases: state.Cases,
  Warehouses: state.Warehouses,
  Floors: state.Floors,
  Rooms: state.Rooms,
  Beds: state.Beds
})

const mapDispatchToProps = {
  GetPatients, CompletePrepatients, DeletePatients, GetPatientstockmovements,
  handleDeletemodal, handleSelectedPatient, fillPatientnotification, GetWarehouses, GetStockdefines,
  GetCases, GetPatientdefines, GetRooms, handleCompletemodal,
  GetBeds, GetFloors, GetFiles, GetPatientstocks
}

export default connect(mapStateToProps, mapDispatchToProps)(Preregistrations)