import { connect } from 'react-redux'
import PurchaseordersEdit from '../../Pages/Purchaseorders/PurchaseordersEdit'
import { EditPurchaseorders, GetPurchaseorder, fillPurchaseordernotification } from "../../Redux/PurchaseorderSlice"
import { GetStockdefines, AddStockdefines, fillStockdefinenotification } from "../../Redux/StockdefineSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetWarehouses } from "../../Redux/WarehouseSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetPurchaseorderstocks } from "../../Redux/PurchaseorderstockSlice"

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Purchaseorderstocks: state.Purchaseorderstocks,
    Stockdefines: state.Stockdefines,
    Cases: state.Cases,
    Departments: state.Departments,
    Warehouses: state.Warehouses,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditPurchaseorders, GetPurchaseorder, fillPurchaseordernotification,
    GetStockdefines, AddStockdefines, fillStockdefinenotification, GetWarehouses,
    GetCases, GetDepartments, GetPurchaseorderstocks
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersEdit)