import { connect } from 'react-redux'
import PreregistrationsComplete from "../../Pages/Preregistrations/PreregistrationsComplete"
import { fillPatientnotification, CompletePatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetStocks } from '../../Redux/StockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetUnits } from '../../Redux/UnitSlice'
import { GetCases } from '../../Redux/CaseSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'
import { GetStocktypegroups } from '../../Redux/StocktypegroupSlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetFiles } from '../../Redux/FileSlice'
import { GetUsagetypes } from '../../Redux/UsagetypeSlice'
import { GetCostumertypes } from '../../Redux/CostumertypeSlice'
import { GetPatienttypes } from '../../Redux/PatienttypeSlice'
import { GetFloors } from '../../Redux/FloorSlice'
import { GetBeds } from '../../Redux/BedSlice'
import { GetRooms } from '../../Redux/RoomSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Stocks: state.Stocks,
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Cases: state.Cases,
    Departments: state.Departments,
    Stocktypes: state.Stocktypes,
    Stocktypegroups: state.Stocktypegroups,
    Users: state.Users,
    Files: state.Files,
    Floors: state.Floors,
    Rooms: state.Rooms,
    Beds: state.Beds,
    Usagetypes: state.Usagetypes,
    Costumertypes: state.Costumertypes,
    Patienttypes: state.Patienttypes,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    fillPatientnotification, CompletePatients, GetPatientdefines, GetStocks, GetStockdefines, GetUnits, GetCases, GetDepartments,
    GetStocktypes, GetStocktypegroups, GetUsers, GetFiles, GetUsagetypes, GetCostumertypes, GetPatienttypes, GetBeds, GetFloors, GetRooms
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsComplete)