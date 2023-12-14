import { connect } from 'react-redux'
import UnapprovedStocks from '../../Pages/Unapproveds/UnapprovedStocks'
import { GetPatientstocks, fillPatientstocknotification, ApprovePatientstocks, ApprovemultiplePatientstocks } from '../../Redux/PatientstockSlice'
import { GetStocks, fillStocknotification, ApproveStocks, ApprovemultipleStocks } from '../../Redux/StockSlice'
import { GetPurchaseorderstocks, fillPurchaseorderstocknotification, ApprovePurchaseorderstocks, ApprovemultiplePurchaseorderstocks } from '../../Redux/PurchaseorderstockSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetPatientstockmovements } from '../../Redux/PatientstockmovementSlice'
import { GetPurchaseorders } from '../../Redux/PurchaseorderSlice'
import { GetPurchaseorderstockmovements } from '../../Redux/PurchaseorderstockmovementSlice'
import { GetStockmovements } from '../../Redux/StockmovementSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetUnits } from '../../Redux/UnitSlice'
import { GetWarehouses } from '../../Redux/WarehouseSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientstocks: state.Patientstocks,
    Patientstockmovements: state.Patientstockmovements,
    Patientdefines: state.Patientdefines,
    Purchaseorders: state.Purchaseorders,
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Stocks: state.Stocks,
    Stockmovements: state.Stockmovements,
    Departments: state.Departments,
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Warehouses: state.Warehouses,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatients, GetPatientstocks, fillPatientstocknotification, ApprovePatientstocks, GetPatientstockmovements, GetPatientdefines,
    GetPurchaseorders, GetPurchaseorderstocks, fillPurchaseorderstocknotification, ApprovePurchaseorderstocks, GetPurchaseorderstockmovements,
    GetStocks, fillStocknotification, ApproveStocks, GetStockmovements, GetDepartments, GetStockdefines, GetUnits, ApprovemultiplePatientstocks,
    ApprovemultipleStocks, ApprovemultiplePurchaseorderstocks, GetWarehouses
}


export default connect(mapStateToProps, mapDispatchToProps)(UnapprovedStocks)