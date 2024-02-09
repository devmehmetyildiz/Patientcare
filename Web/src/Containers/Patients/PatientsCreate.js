import { connect } from 'react-redux'
import PatientsCreate from '../../Pages/Patients/PatientsCreate'
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { AddPatientReturnPatient, fillPatientnotification } from "../../Redux/PatientSlice"
import { EditFiles } from "../../Redux/FileSlice"
import { EditPatientstocks } from "../../Redux/PatientstockSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetCostumertypes } from "../../Redux/CostumertypeSlice"
import { GetPatienttypes } from "../../Redux/PatienttypeSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetBeds } from "../../Redux/BedSlice"
import { GetWarehouses } from "../../Redux/WarehouseSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Departments: state.Departments,
  Cases: state.Cases,
  Costumertypes: state.Costumertypes,
  Patienttypes: state.Patienttypes,
  Stockdefines: state.Stockdefines,
  Floors: state.Floors,
  Rooms: state.Rooms,
  Beds: state.Beds,
  Warehouses: state.Warehouses,
  Usagetypes: state.Usagetypes,
  Profile: state.Profile,
})

const mapDispatchToProps = {
  GetPatientdefines, GetDepartments, GetCases, GetCostumertypes, fillPatientnotification, EditPatientstocks,
  GetPatienttypes, GetStockdefines, GetFloors, GetRooms, GetBeds, GetWarehouses, EditFiles, AddPatientReturnPatient, GetUsagetypes
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsCreate)