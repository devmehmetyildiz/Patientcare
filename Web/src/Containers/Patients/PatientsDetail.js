import { connect } from 'react-redux'
import PatientsDetail from '../../Pages/Patients/PatientsDetail'
import { GetPatient, removePatientnotification, setPatient, handleDeletemodal, handleSelectedPatient, handleInmodal, handleOutmodal } from "../../Redux/PatientSlice"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/PatientdefineSlice"
import { GetCases, removeCasenotification } from "../../Redux/CaseSlice"
import { GetCostumertypes, removeCostumertypenotification } from "../../Redux/CostumertypeSlice"
import { GetPatienttypes, removePatienttypenotification } from "../../Redux/PatienttypeSlice"
import { GetFloors, removeFloornotification } from "../../Redux/FloorSlice"
import { GetRooms, removeRoomnotification } from "../../Redux/RoomSlice"
import { GetBeds, removeBednotification } from "../../Redux/BedSlice"
import { GetPatientstocks, removePatientstocknotification } from "../../Redux/PatientstockSlice"
import { GetStockdefines, removeStockdefinenotification } from "../../Redux/StockdefineSlice"
import { GetUnits, removeUnitnotification } from "../../Redux/UnitSlice"
import { GetPatientmovements, removePatientmovementnotification } from "../../Redux/PatientmovementSlice"
import { GetFiles, removeFilenotification } from "../../Redux/FileSlice"
import { GetPatientstockmovements, removePatientstockmovementnotification } from "../../Redux/PatientstockmovementSlice"
import { GetTodosbyPatient, removeTodonotification } from "../../Redux/TodoSlice"
import { GetTododefines, removeTododefinenotification } from "../../Redux/TododefineSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Cases: state.Cases,
    Profile: state.Profile,
    Patienttypes: state.Patienttypes,
    Costumertypes: state.Costumertypes,
    Floors: state.Floors,
    Rooms: state.Rooms,
    Beds: state.Beds,
    Patientstocks: state.Patientstocks,
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Patientmovements: state.Patientmovements,
    Files: state.Files,
    Patientstockmovements: state.Patientstockmovements,
    Todos: state.Todos,
    Tododefines: state.Tododefines,
})

const mapDispatchToProps = {
    GetPatient, removePatientnotification, setPatient, handleDeletemodal, handleSelectedPatient,
    GetPatientdefines, removePatientdefinenotification, GetCases, removeCasenotification,
    GetCostumertypes, removeCostumertypenotification, GetPatienttypes, removePatienttypenotification,
    GetFloors, removeFloornotification, GetRooms, removeRoomnotification, GetBeds, removeBednotification,
    GetPatientstocks, removePatientstocknotification, GetStockdefines, removeStockdefinenotification, GetUnits,
    removeUnitnotification, GetPatientmovements, removePatientmovementnotification, GetFiles, removeFilenotification,
    GetPatientstockmovements, removePatientstockmovementnotification, handleInmodal, handleOutmodal, GetTodosbyPatient, removeTodonotification
    , GetTododefines, removeTododefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsDetail)