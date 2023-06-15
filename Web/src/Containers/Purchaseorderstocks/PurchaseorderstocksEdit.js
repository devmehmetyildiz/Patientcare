import { connect } from 'react-redux'
import { EditPurchaseorderstocks, GetPurchaseorderstock, RemoveSelectedPurchaseorderstock, removePurchaseorderstocknotification, fillPurchaseorderstocknotification } from '../../Redux/Reducers/PurchaseorderstockReducer'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/Reducers/StockdefineReducer'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/Reducers/DepartmentReducer'
import { GetPurchaseorders, removePurchaseordernotification } from "../../Redux/Reducers/PurchaseorderReducer"
import PurchaseorderstocksEdit from '../../Pages/Purchaseorderstocks/PurchaseorderstocksEdit'

const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorders: state.Purchaseorders,
    Stockdefines: state.Stockdefines,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditPurchaseorderstocks, GetPurchaseorderstock, RemoveSelectedPurchaseorderstock, removePurchaseorderstocknotification, fillPurchaseorderstocknotification,
    GetStockdefines, removeStockdefinenotification, GetDepartments, removeDepartmentnotification,GetPurchaseorders, removePurchaseordernotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstocksEdit)