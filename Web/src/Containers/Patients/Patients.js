import { connect } from 'react-redux'
import Patients from '../../Pages/Patients/Patients'
import { GetPatients, setPatient, handleDeletemodal, handleSelectedPatient, handleDetailmodal, fillPatientnotification } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetBeds } from "../../Redux/BedSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"
import { GetFiles } from "../../Redux/FileSlice"
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { GetPatienttypes } from '../../Redux/PatienttypeSlice'
import { GetUnits } from '../../Redux/UnitSlice'
import { GetCostumertypes } from '../../Redux/CostumertypeSlice'
import { GetStocks } from '../../Redux/StockSlice'
import { GetPatientcashregisters } from '../../Redux/PatientcashregisterSlice'
import { GetPatientcashmovements } from '../../Redux/PatientcashmovementSlice'
import { GetStockmovements } from '../../Redux/StockmovementSlice'
import { GetPatienteventdefines } from '../../Redux/PatienteventdefineSlice'
import { GetPatienthealthcases } from '../../Redux/PatienthealthcaseSlice'
import { GetPatienthealthcasedefines } from '../../Redux/PatienthealthcasedefineSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'
import { GetStocktypegroups } from '../../Redux/StocktypegroupSlice'
import { GetUsers } from '../../Redux/UserSlice'

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
  GetStockdefines, GetUsagetypes, handleDetailmodal, fillPatientnotification,
  GetDepartments, GetPatienttypes, GetUnits, GetStocktypegroups, GetStocktypes, GetUsers, GetCostumertypes, GetStocks,
  GetPatientcashregisters, GetPatientcashmovements,
  GetStockmovements, GetPatienteventdefines,
  GetPatienthealthcases, GetPatienthealthcasedefines, GetUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Patients)