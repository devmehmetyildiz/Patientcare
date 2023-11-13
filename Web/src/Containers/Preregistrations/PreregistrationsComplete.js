import { connect } from 'react-redux'
import PreregistrationsComplete from "../../Pages/Preregistrations/PreregistrationsComplete"
import { GetPatient, GetPatients, fillPatientnotification, CompletePrepatients, handleCompletemodal, handleSelectedPatient } from "../../Redux/PatientSlice"
import { GetWarehouses } from "../../Redux/WarehouseSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetBeds } from "../../Redux/BedSlice"
import { GetFiles } from "../../Redux/FileSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetPatientstocks } from "../../Redux/PatientstockSlice"
import { GetPatientstockmovements } from "../../Redux/PatientstockmovementSlice"
import { GetUnits } from "../../Redux/UnitSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

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
    Stockdefines: state.Stockdefines,
    Cases: state.Cases,
    Departments: state.Departments
})

const mapDispatchToProps = {
    CompletePrepatients, handleCompletemodal, handleSelectedPatient, GetWarehouses,
    GetRooms, GetFloors, GetPatient,
    GetBeds, GetFiles, GetPatientdefines,
    GetPatients, fillPatientnotification,
    GetPatientstockmovements, GetPatientstocks,
    GetUnits, GetStockdefines, GetCases, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsComplete)

