import { connect } from 'react-redux'
import { EditPurchaseorderstocks, GetPurchaseorderstock, RemoveSelectedPurchaseorderstock, removePurchaseorderstocknotification, fillPurchaseorderstocknotification } from '../../Redux/Actions/PurchaseorderstockAction'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/Actions/StockdefineAction'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/Actions/DepartmentAction'
import { GetPurchaseorders, removePurchaseordernotification } from "../../Redux/Actions/PurchaseorderAction"
import PurchaseorderstocksEdit from '../../Pages/Purchaseorderstocks/PurchaseorderstocksEdit'

const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorders: state.Purchaseorders,
    Stockdefines: state.Stockdefines,
    Departments: state.Departments,
})

const mapDispatchToProps = {
    EditPurchaseorderstocks, GetPurchaseorderstock, RemoveSelectedPurchaseorderstock, removePurchaseorderstocknotification, fillPurchaseorderstocknotification,
    GetStockdefines, removeStockdefinenotification, GetDepartments, removeDepartmentnotification,GetPurchaseorders, removePurchaseordernotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstocksEdit)