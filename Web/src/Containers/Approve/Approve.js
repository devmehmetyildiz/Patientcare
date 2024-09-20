import { connect } from 'react-redux'
import Approve from "../../Pages/Approve/Approve"
import { GetStocks } from '../../Redux/StockSlice'
import { GetStockmovements, ApproveStockmovements } from '../../Redux/StockmovementSlice'
import { GetPatients, ApprovePatients } from '../../Redux/PatientSlice'
import { GetCases } from '../../Redux/CaseSlice'
import { GetFiles } from '../../Redux/FileSlice'
import { GetUsagetypes } from '../../Redux/UsagetypeSlice'
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
    Cases: state.Cases,
    Usagetypes: state.Usagetypes,
    Files: state.Files,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetStocks, GetStockmovements, GetPatients, GetCases, GetStockdefines, GetPurchaseorders, GetClaimpaymentparameters,
    GetFiles, GetUsagetypes, GetUsers, GetStocktypes, GetUnits, GetPatientdefines, GetWarehouses, GetClaimpayments,
    GetCostumertypes,
    ApproveStockmovements, ApprovePatients
}

export default connect(mapStateToProps, mapDispatchToProps)(Approve)