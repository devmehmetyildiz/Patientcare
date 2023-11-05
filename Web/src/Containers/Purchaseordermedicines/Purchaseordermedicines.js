import { connect } from 'react-redux'
import Purchaseordermedicines from '../../Pages/Purchaseordermedicines/Purchaseordermedicines'
import {
    GetPurchaseorderstocks, fillPurchaseorderstocknotification, DeletePurchaseorderstocks
    , handleDeletemodal, handleSelectedPurchaseorderstock
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
    handleDeletemodal, handleSelectedPurchaseorderstock, GetDepartments,
    GetStockdefines, GetPurchaseorderstockmovements,
    GetPurchaseorders
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchaseordermedicines)