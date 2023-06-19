import { connect } from 'react-redux'
import PurchaseordersComplete from '../../Pages/Purchaseorders/PurchaseordersComplete'
import { CompletePurchaseorders, handleCompletemodal, handleSelectedPurchaseorder } from "../../Redux/PurchaseorderSlice"

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Profile: state.Profile
})

const mapDispatchToProps = {
    handleSelectedPurchaseorder, CompletePurchaseorders, handleCompletemodal
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersComplete)