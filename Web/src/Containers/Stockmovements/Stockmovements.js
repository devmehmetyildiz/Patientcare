import { connect } from 'react-redux'
import Stockmovements from '../../Pages/Stockmovements/Stockmovements'
import {
    GetStockmovements, handleApprovemodal,
    fillStockmovementnotification, DeleteStockmovements, handleDeletemodal, handleSelectedStockmovement
} from '../../Redux/StockmovementSlice'
import { GetUnits } from '../../Redux/UnitSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetStocks } from '../../Redux/StockSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'
import { GetWarehouses } from '../../Redux/WarehouseSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetPurchaseorders } from '../../Redux/PurchaseorderSlice'

const mapStateToProps = (state) => ({
    Stockmovements: state.Stockmovements,
    Stocks: state.Stocks,
    Stockdefines: state.Stockdefines,
    Warehouses: state.Warehouses,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Purchaseorders: state.Purchaseorders,
    Units: state.Units,
    Stocktypes: state.Stocktypes,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetStockmovements, fillStockmovementnotification, DeleteStockmovements,
    handleDeletemodal, handleSelectedStockmovement, GetUnits, GetStockdefines,
    GetStocks, handleApprovemodal, GetStocktypes, GetWarehouses, GetPatients, GetPatientdefines, GetPurchaseorders
}

export default connect(mapStateToProps, mapDispatchToProps)(Stockmovements)