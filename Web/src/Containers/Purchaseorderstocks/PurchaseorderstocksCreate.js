import { connect } from 'react-redux'
import PurchaseorderstocksCreate from '../../Pages/Purchaseorderstocks/PurchaseorderstocksCreate'
import { AddPurchaseorderstocks, removePurchaseorderstocknotification, fillPurchaseorderstocknotification } from '../../Redux/Actions/PurchaseorderstockAction'
import { GetPurchaseorders, removePurchaseordernotification } from "../../Redux/Actions/PurchaseorderAction"
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/Actions/StockdefineAction'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/Actions/DepartmentAction'

const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorders: state.Purchaseorders,
    Stockdefines: state.Stockdefines,
    Departments: state.Departments,
})


const mapDispatchToProps = {
    AddPurchaseorderstocks, removePurchaseorderstocknotification, fillPurchaseorderstocknotification,
    GetPurchaseorders, removePurchaseordernotification, GetStockdefines, removeStockdefinenotification,GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstocksCreate)