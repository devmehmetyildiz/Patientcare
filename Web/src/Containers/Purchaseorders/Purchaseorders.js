import { connect } from 'react-redux'
import Purchaseorders from '../../Pages/Purchaseorders/Purchaseorders'
import { GetPurchaseorders, removePurchaseordernotification, DeletePurchaseorders,CompletePurchaseorders } from "../../Redux/Actions/PurchaseorderAction"
import { GetPurchaseorderstocks, removePurchaseorderstocknotification } from "../../Redux/Actions/PurchaseorderstockAction"

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