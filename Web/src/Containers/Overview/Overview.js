import { connect } from 'react-redux'
import Overview from '../../Pages/Overview/Overview'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetPatienteventdefines } from '../../Redux/PatienteventdefineSlice'
import { GetFiles } from '../../Redux/FileSlice'
import { GetUsagetypes } from '../../Redux/UsagetypeSlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetProfessions } from '../../Redux/ProfessionSlice'
import { GetCompanycashmovements } from '../../Redux/CompanycashmovementSlice'
import { GetStocks } from '../../Redux/StockSlice'
import { GetPurchaseorders } from '../../Redux/PurchaseorderSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetStockmovements } from '../../Redux/StockmovementSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'
import { GetStocktypegroups } from '../../Redux/StocktypegroupSlice'
import { GetUnits } from '../../Redux/UnitSlice'
import { GetCases } from '../../Redux/CaseSlice'
import { GetCostumertypes } from '../../Redux/CostumertypeSlice'
import { GetPatienttypes } from '../../Redux/PatienttypeSlice'
import { GetTrainings } from '../../Redux/TrainingSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { GetStayedPatientCount, GetPatientIncomeOutcome } from '../../Redux/OverviewcardSlice'

const mapStateToProps = (state) => ({
    Overviewcards: state.Overviewcards,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patienteventdefines: state.Patienteventdefines,
    Files: state.Files,
    Usagetypes: state.Usagetypes,
    Users: state.Users,
    Professions: state.Professions,
    Companycashmovements: state.Companycashmovements,
    Stocks: state.Stocks,
    Stockdefines: state.Stockdefines,
    Stocktypes: state.Stocktypes,
    Stocktypegroups: state.Stocktypegroups,
    Purchaseorders: state.Purchaseorders,
    Cases: state.Cases,
    Costumertypes: state.Costumertypes,
    Patienttypes: state.Patienttypes,
    Trainings: state.Trainings,
    Units: state.Units,
    Departments: state.Departments,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetPatients, GetPatientdefines, GetPatienteventdefines, GetFiles, GetUsagetypes, GetUsers, GetProfessions,
    GetCompanycashmovements, GetStocks, GetPurchaseorders, GetStockdefines, GetStockmovements, GetStocktypes,
    GetStocktypegroups, GetUnits, GetCases, GetCostumertypes, GetPatienttypes, GetTrainings, GetDepartments,
    GetStayedPatientCount, GetPatientIncomeOutcome
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview)