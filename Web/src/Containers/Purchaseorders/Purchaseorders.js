import { connect } from 'react-redux'
import Purchaseorders from '../../Pages/Purchaseorders/Purchaseorders'
import { GetPurchaseorders, removePurchaseordernotification, DeletePurchaseorders,CompletePurchaseorders } from "../../Redux/PurchaseorderSlice"
import { GetPurchaseorderstocks, removePurchaseorderstocknotification } from "../../Redux/PurchaseorderstockSlice"

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Purchaseorderstocks: state.Purchaseorderstocks,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPurchaseorders, removePurchaseordernotification, DeletePurchaseorders,
    GetPurchaseorderstocks, removePurchaseorderstocknotification,CompletePurchaseorders
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchaseorders)