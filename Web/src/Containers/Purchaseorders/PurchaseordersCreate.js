import { connect } from 'react-redux'
import PurchaseordersCreate from '../../Pages/Purchaseorders/PurchaseordersCreate'
import { AddPurchaseorders, fillPurchaseordernotification, removePurchaseordernotification } from "../../Redux/PurchaseorderSlice"
import { GetStockdefines, removeStockdefinenotification, AddStockdefines, fillStockdefinenotification } from "../../Redux/StockdefineSlice"
import { GetCases, removeCasenotification } from "../../Redux/CaseSlice"
import { GetWarehouses, removeWarehousenotification } from "../../Redux/WarehouseSlice"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Stockdefines: state.Stockdefines,
    Cases: state.Cases,
    Departments: state.Departments,
    Warehouses: state.Warehouses,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPurchaseorders, fillPurchaseordernotification, removePurchaseordernotification,
    GetStockdefines, removeStockdefinenotification, AddStockdefines, fillStockdefinenotification, GetWarehouses, removeWarehousenotification,
    GetCases, removeCasenotification, GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersCreate)