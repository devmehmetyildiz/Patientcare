import { connect } from 'react-redux'
import Approve from "../../Pages/Approve/Approve"
import { GetStocks } from '../../Redux/StockSlice'
import { GetStockmovements } from '../../Redux/StockmovementSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'
import { GetUnits } from '../../Redux/UnitSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetWarehouses } from '../../Redux/WarehouseSlice'
import { GetPurchaseorders } from '../../Redux/PurchaseorderSlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetClaimpaymentparameters } from '../../Redux/ClaimpaymentparameterSlice'
import { GetClaimpayments } from '../../Redux/ClaimpaymentSlice'
import { GetCostumertypes } from '../../Redux/CostumertypeSlice'
import { GetPatientvisits } from '../../Redux/PatientvisitSlice'
import { GetPatientactivities } from '../../Redux/PatientactivitySlice'
import { GetUserincidents } from '../../Redux/UserincidentSlice'
import { GetSurveys } from '../../Redux/SurveySlice'
import { GetTrainings } from '../../Redux/TrainingSlice'
import { GetMainteanceplans } from '../../Redux/MainteanceplanSlice'
import { GetEquipments } from '../../Redux/EquipmentSlice'
import { GetCareplans } from '../../Redux/CareplanSlice'
import { GetPersonelshifts } from '../../Redux/PersonelshiftSlice'
import { GetPersonelpresettings } from '../../Redux/PersonelpresettingSlice'
import { GetProfessionpresettings } from '../../Redux/ProfessionpresettingSlice'
import { GetProfessions } from '../../Redux/ProfessionSlice'

const mapStateToProps = (state) => ({
    Claimpayments: state.Claimpayments,
    Claimpaymentparameters: state.Claimpaymentparameters,
    Costumertypes: state.Costumertypes,
    Stocks: state.Stocks,
    Stockmovements: state.Stockmovements,
    Warehouses: state.Warehouses,
    Purchaseorders: state.Purchaseorders,
    Stockdefines: state.Stockdefines,
    Stocktypes: state.Stocktypes,
    Users: state.Users,
    Units: state.Units,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patientvisits: state.Patientvisits,
    Patientactivities: state.Patientactivities,
    Userincidents: state.Userincidents,
    Surveys: state.Surveys,
    Trainings: state.Trainings,
    Mainteanceplans: state.Mainteanceplans,
    Equipments: state.Equipments,
    Careplans: state.Careplans,
    Personelshifts: state.Personelshifts,
    Personelpresettings: state.Personelpresettings,
    Professionpresettings: state.Professionpresettings,
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetStocks, GetStockmovements, GetPatients, GetStockdefines, GetPurchaseorders, GetClaimpaymentparameters,
    GetUsers, GetStocktypes, GetUnits, GetPatientdefines, GetWarehouses, GetClaimpayments, GetMainteanceplans,
    GetCostumertypes, GetPatientvisits, GetPatientactivities, GetUserincidents, GetSurveys, GetTrainings,
    GetEquipments, GetCareplans, GetPersonelpresettings, GetPersonelshifts, GetProfessionpresettings, GetProfessions

}

export default connect(mapStateToProps, mapDispatchToProps)(Approve)