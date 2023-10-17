import { connect } from 'react-redux'
import PreregistrationsComplete from "../../Pages/Preregistrations/PreregistrationsComplete"
import { GetPatient, GetPatients, fillPatientnotification, removePatientnotification, CompletePrepatients, handleCompletemodal, handleSelectedPatient } from "../../Redux/PatientSlice"
import { GetWarehouses, removeWarehousenotification } from "../../Redux/WarehouseSlice"
import { GetRooms, removeRoomnotification } from "../../Redux/RoomSlice"
import { GetFloors, removeFloornotification } from "../../Redux/FloorSlice"
import { GetBeds, removeBednotification } from "../../Redux/BedSlice"
import { GetFiles, removeFilenotification } from "../../Redux/FileSlice"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/PatientdefineSlice"
import { GetPatientstocks, removePatientstocknotification } from "../../Redux/PatientstockSlice"
import { GetPatientstockmovements, removePatientstockmovementnotification } from "../../Redux/PatientstockmovementSlice"
import { GetUnits, removeUnitnotification } from "../../Redux/UnitSlice"
import { GetStockdefines, removeStockdefinenotification } from "../../Redux/StockdefineSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Profile: state.Profile,
    Warehouses: state.Warehouses,
    Rooms: state.Rooms,
    Beds: state.Beds,
    Floors: state.Floors,
    Files: state.Files,
    Patientdefines: state.Patientdefines,
    Patientstocks: state.Patientstocks,
    Patientstockmovements: state.Patientstockmovements,
    Units: state.Units,
    Stockdefines: state.Stockdefines
})

const mapDispatchToProps = {
    CompletePrepatients, handleCompletemodal, handleSelectedPatient, GetWarehouses,
    removeWarehousenotification, GetRooms, removeRoomnotification, GetFloors, GetPatient,
    removeFloornotification, GetBeds, removeBednotification, GetFiles, GetPatientdefines, removePatientdefinenotification,
    removeFilenotification, GetPatients, removePatientnotification, fillPatientnotification,
    GetPatientstockmovements, removePatientstockmovementnotification, GetPatientstocks, removePatientstocknotification,
    GetUnits, removeUnitnotification, GetStockdefines, removeStockdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsComplete)

