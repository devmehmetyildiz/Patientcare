import { connect } from 'react-redux'
import PurchaseordersDelete from "../../Pages/Purchaseorders/PurchaseordersDelete"
import { DeletePurchaseorders, handleDeletemodal, handleSelectedPurchaseorder } from "../../Redux/PurchaseorderSlice"

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePurchaseorders, handleDeletemodal, handleSelectedPurchaseorder
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersDelete)