import { connect } from 'react-redux'
import { EditPurchaseorderstocks, GetPurchaseorderstock, handleSelectedPurchaseorderstock,  fillPurchaseorderstocknotification } from '../../Redux/PurchaseorderstockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { GetPurchaseorders } from "../../Redux/PurchaseorderSlice"
import PurchaseorderstocksEdit from '../../Pages/Purchaseorderstocks/PurchaseorderstocksEdit'

const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorders: state.Purchaseorders,
    Stockdefines: state.Stockdefines,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditPurchaseorderstocks, GetPurchaseorderstock, handleSelectedPurchaseorderstock,  fillPurchaseorderstocknotification,
    GetStockdefines,  GetDepartments, GetPurchaseorders
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstocksEdit)