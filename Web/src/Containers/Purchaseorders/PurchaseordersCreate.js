import { connect } from 'react-redux'
import PurchaseordersCreate from '../../Pages/Purchaseorders/PurchaseordersCreate'
import { AddPurchaseorders, fillPurchaseordernotification } from "../../Redux/PurchaseorderSlice"
import { GetStockdefines, AddStockdefines, fillStockdefinenotification } from "../../Redux/StockdefineSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetWarehouses } from "../../Redux/WarehouseSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Stockdefines: state.Stockdefines,
    Cases: state.Cases,
    Departments: state.Departments,
    Warehouses: state.Warehouses,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPurchaseorders, fillPurchaseordernotification,
    GetStockdefines, AddStockdefines, fillStockdefinenotification, GetWarehouses,
    GetCases, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersCreate)