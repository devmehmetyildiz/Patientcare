import { connect } from 'react-redux'
import Purchaseorders from '../../Pages/Purchaseorders/Purchaseorders'
import { GetPurchaseorders, removePurchaseordernotification, DeletePurchaseorders, CompletePurchaseorders, handleDeletemodal, handleCompletemodal, handleSelectedPurchaseorder } from "../../Redux/PurchaseorderSlice"
import { GetPurchaseorderstocks, removePurchaseorderstocknotification } from "../../Redux/PurchaseorderstockSlice"
import { GetStockdefines, removeStockdefinenotification } from "../../Redux/StockdefineSlice"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/DepartmentSlice"
import { GetPurchaseorderstockmovements, removePurchaseorderstockmovementnotification } from "../../Redux/PurchaseorderstockmovementSlice"
import { GetCases, removeCasenotification } from "../../Redux/CaseSlice"

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Purchaseorderstocks: state.Purchaseorderstocks,
    Profile: state.Profile,
    Departments: state.Departments,
    Stockdefines: state.Stockdefines,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Cases: state.Cases,
})

const mapDispatchToProps = {
    GetPurchaseorders, removePurchaseordernotification, DeletePurchaseorders, handleDeletemodal, handleSelectedPurchaseorder,
    GetPurchaseorderstocks, removePurchaseorderstocknotification, CompletePurchaseorders, handleCompletemodal,
    GetStockdefines, removeStockdefinenotification, GetDepartments, removeDepartmentnotification, GetPurchaseorderstockmovements,
    removePurchaseorderstockmovementnotification, GetCases, removeCasenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchaseorders)