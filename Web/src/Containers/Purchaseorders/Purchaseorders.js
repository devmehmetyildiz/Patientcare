import { connect } from 'react-redux'
import Purchaseorders from '../../Pages/Purchaseorders/Purchaseorders'
import { GetPurchaseorders, DeletePurchaseorders, CompletePurchaseorders, handleDeletemodal, handleCompletemodal, handleSelectedPurchaseorder } from "../../Redux/PurchaseorderSlice"
import { GetPurchaseorderstocks } from "../../Redux/PurchaseorderstockSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetPurchaseorderstockmovements } from "../../Redux/PurchaseorderstockmovementSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetWarehouses } from "../../Redux/WarehouseSlice"

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Purchaseorderstocks: state.Purchaseorderstocks,
    Profile: state.Profile,
    Departments: state.Departments,
    Stockdefines: state.Stockdefines,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Cases: state.Cases,
    Warehouses: state.Warehouses
})

const mapDispatchToProps = {
    GetPurchaseorders, DeletePurchaseorders, handleDeletemodal, handleSelectedPurchaseorder,
    GetPurchaseorderstocks, CompletePurchaseorders, handleCompletemodal,
    GetStockdefines, GetDepartments, GetPurchaseorderstockmovements,
    GetCases, GetWarehouses
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchaseorders)