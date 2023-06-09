import { connect } from 'react-redux'
import PurchaseordersEdit from '../../Pages/Purchaseorders/PurchaseordersEdit'
import { EditPurchaseorders, GetPurchaseorder, fillPurchaseordernotification, removePurchaseordernotification } from "../../Redux/Actions/PurchaseorderAction"
import { GetStockdefines, removeStockdefinenotification, AddStockdefines, fillStockdefinenotification } from "../../Redux/Actions/StockdefineAction"
import { GetCases, removeCasenotification } from "../../Redux/Actions/CaseAction"
import { GetWarehouses, removeWarehousenotification } from "../../Redux/Actions/WarehouseAction"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Actions/DepartmentAction"

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Stockdefines: state.Stockdefines,
    Cases: state.Cases,
    Departments: state.Departments,
    Warehouses: state.Warehouses,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditPurchaseorders, GetPurchaseorder, fillPurchaseordernotification, removePurchaseordernotification,
    GetStockdefines, removeStockdefinenotification, AddStockdefines, fillStockdefinenotification, GetWarehouses, removeWarehousenotification,
    GetCases, removeCasenotification,  GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersEdit)