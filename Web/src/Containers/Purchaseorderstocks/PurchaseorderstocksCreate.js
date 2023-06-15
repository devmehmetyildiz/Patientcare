import { connect } from 'react-redux'
import PurchaseorderstocksCreate from '../../Pages/Purchaseorderstocks/PurchaseorderstocksCreate'
import { AddPurchaseorderstocks, removePurchaseorderstocknotification, fillPurchaseorderstocknotification } from '../../Redux/Reducers/PurchaseorderstockReducer'
import { GetPurchaseorders, removePurchaseordernotification } from "../../Redux/Reducers/PurchaseorderReducer"
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/Reducers/StockdefineReducer'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/Reducers/DepartmentReducer'

const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorders: state.Purchaseorders,
    Stockdefines: state.Stockdefines,
    Departments: state.Departments,
    Profile: state.Profile
})


const mapDispatchToProps = {
    AddPurchaseorderstocks, removePurchaseorderstocknotification, fillPurchaseorderstocknotification,
    GetPurchaseorders, removePurchaseordernotification, GetStockdefines, removeStockdefinenotification,GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstocksCreate)