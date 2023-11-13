import { connect } from 'react-redux'
import Purchaseordersupplies from '../../Pages/Purchaseordersupplies/Purchaseordersupplies'
import {
    GetPurchaseorderstocks, fillPurchaseorderstocknotification, DeletePurchaseorderstocks
    , handleApprovemodal, handleDeletemodal, handleSelectedPurchaseorderstock
} from '../../Redux/PurchaseorderstockSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetPurchaseorderstockmovements } from '../../Redux/PurchaseorderstockmovementSlice'
import { GetPurchaseorders } from '../../Redux/PurchaseorderSlice'


const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Profile: state.Profile,
    Departments: state.Departments,
    Stockdefines: state.Stockdefines,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Purchaseorders: state.Purchaseorders
})

const mapDispatchToProps = {
    GetPurchaseorderstocks, fillPurchaseorderstocknotification, DeletePurchaseorderstocks,
    handleDeletemodal, handleSelectedPurchaseorderstock, GetDepartments, handleApprovemodal,
    GetStockdefines, GetPurchaseorderstockmovements, GetPurchaseorders
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchaseordersupplies)