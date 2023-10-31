import { connect } from 'react-redux'
import Purchaseordersupplies from '../../Pages/Purchaseordersupplies/Purchaseordersupplies'
import {
    GetPurchaseorderstocks, removePurchaseorderstocknotification, fillPurchaseorderstocknotification, DeletePurchaseorderstocks
    , handleDeletemodal, handleSelectedPurchaseorderstock
} from '../../Redux/PurchaseorderstockSlice'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/DepartmentSlice'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/StockdefineSlice'
import { GetPurchaseorderstockmovements, removePurchaseorderstockmovementnotification } from '../../Redux/PurchaseorderstockmovementSlice'
import { GetPurchaseorders, removePurchaseordernotification } from '../../Redux/PurchaseorderSlice'


const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Profile: state.Profile,
    Departments: state.Departments,
    Stockdefines: state.Stockdefines,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Purchaseorders: state.Purchaseorders
})

const mapDispatchToProps = {
    GetPurchaseorderstocks, removePurchaseorderstocknotification, fillPurchaseorderstocknotification, DeletePurchaseorderstocks,
    handleDeletemodal, handleSelectedPurchaseorderstock, GetDepartments, removeDepartmentnotification,
    GetStockdefines, removeStockdefinenotification, GetPurchaseorderstockmovements, removePurchaseorderstockmovementnotification,
    GetPurchaseorders, removePurchaseordernotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchaseordersupplies)