import { connect } from 'react-redux'
import PatientsDetail from '../../Pages/Patients/PatientsDetail'
import { GetPatient, handleSelectedPatient, fillPatientnotification } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetFiles } from "../../Redux/FileSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetCostumertypes } from "../../Redux/CostumertypeSlice"
import { GetPatienttypes } from "../../Redux/PatienttypeSlice"
import { GetFloors } from "../../Redux/FloorSlice"
import { GetRooms } from "../../Redux/RoomSlice"
import { GetBeds } from "../../Redux/BedSlice"
import { GetPatientcashmovements } from "../../Redux/PatientcashmovementSlice"
import { GetPatientcashregisters } from "../../Redux/PatientcashregisterSlice"
import { GetStocks } from "../../Redux/StockSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"
import { GetStockmovements, AddStockmovements } from "../../Redux/StockmovementSlice"
import { GetUsers } from "../../Redux/UserSlice"
import { GetStocktypes } from "../../Redux/StocktypeSlice"
import { GetStocktypegroups } from "../../Redux/StocktypegroupSlice"
import { GetUnits } from "../../Redux/UnitSlice"
import { GetPatienteventdefines } from '../../Redux/PatienteventdefineSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Files: state.Files,
    Usagetypes: state.Usagetypes,
    Cases: state.Cases,
    Departments: state.Departments,
    Costumertypes: state.Costumertypes,
    Patienttypes: state.Patienttypes,
    Floors: state.Floors,
    Rooms: state.Rooms,
    Beds: state.Beds,
    Patientcashregisters: state.Patientcashregisters,
    Patientcashmovements: state.Patientcashmovements,
    Stocks: state.Stocks,
    Stockmovements: state.Stockmovements,
    Stockdefines: state.Stockdefines,
    Users: state.Users,
    Stocktypes: state.Stocktypes,
    Stocktypegroups: state.Stocktypegroups,
    Patienteventdefines: state.Patienteventdefines,
    Units: state.Units,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatient, handleSelectedPatient, fillPatientnotification, GetPatienttypes, GetCostumertypes,
    GetPatientdefines, GetFiles, GetUsagetypes, GetCases, GetDepartments, GetFloors, GetRooms, GetBeds,
    GetPatientcashmovements, GetPatientcashregisters, GetStocks, GetStockdefines, GetStockmovements,
    GetUsers, GetStocktypes, GetStocktypegroups, GetUnits, GetPatienteventdefines, AddStockmovements,
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsDetail)