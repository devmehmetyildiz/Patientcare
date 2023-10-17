import { connect } from 'react-redux'
import Preregistrations from "../../Pages/Preregistrations/Preregistrations"
import { GetPatients, CompletePrepatients, removePatientnotification, DeletePatients, fillPatientnotification, handleDeletemodal, handleSelectedPatient ,handleCompletemodal} from "../../Redux/PatientSlice"
import { GetWarehouses, removeWarehousenotification } from "../../Redux/WarehouseSlice"
import { GetCases, removeCasenotification } from "../../Redux/CaseSlice"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/PatientdefineSlice"
import { GetRooms, removeRoomnotification } from "../../Redux/RoomSlice"
import { GetBeds, removeBednotification } from "../../Redux/BedSlice"
import { GetFloors, removeFloornotification } from "../../Redux/FloorSlice"
import { GetFiles, removeFilenotification } from "../../Redux/FileSlice"
import { GetPatientstocks, removePatientstocknotification } from "../../Redux/PatientstockSlice"
import { GetPatientstockmovements, removePatientstockmovementnotification } from "../../Redux/PatientstockmovementSlice"
import { GetStockdefines, removeStockdefinenotification } from "../../Redux/StockdefineSlice"

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
  GetPatients, CompletePrepatients, removePatientnotification, DeletePatients, GetPatientstockmovements, removePatientstockmovementnotification,
  handleDeletemodal, handleSelectedPatient, fillPatientnotification, GetWarehouses, removeWarehousenotification, GetStockdefines, removeStockdefinenotification,
  GetCases, removeCasenotification, GetPatientdefines, removePatientdefinenotification, GetRooms, removeRoomnotification,handleCompletemodal,
  GetBeds, removeBednotification, GetFloors, removeFloornotification, GetFiles, removeFilenotification, GetPatientstocks, removePatientstocknotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Preregistrations)