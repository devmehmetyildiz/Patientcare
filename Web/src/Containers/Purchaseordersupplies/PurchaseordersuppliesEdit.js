import { connect } from 'react-redux'
import PurchaseordersuppliesEdit from '../../Pages/Purchaseordersupplies/PurchaseordersuppliesEdit'
import { EditPurchaseorderstocks, GetPurchaseorderstock, handleSelectedPurchaseorderstock, removePurchaseorderstocknotification, fillPurchaseorderstocknotification } from '../../Redux/PurchaseorderstockSlice'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/StockdefineSlice'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/DepartmentSlice'
import { GetPurchaseorders, removePurchaseordernotification } from "../../Redux/PurchaseorderSlice"

const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorders: state.Purchaseorders,
    Stockdefines: state.Stockdefines,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditPurchaseorderstocks, GetPurchaseorderstock, handleSelectedPurchaseorderstock, removePurchaseorderstocknotification, fillPurchaseorderstocknotification,
    GetStockdefines, removeStockdefinenotification, GetDepartments, removeDepartmentnotification,GetPurchaseorders, removePurchaseordernotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersuppliesEdit)