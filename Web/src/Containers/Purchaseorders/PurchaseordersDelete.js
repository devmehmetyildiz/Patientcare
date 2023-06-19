import { connect } from 'react-redux'
import PurchaseordersDelete from '../../Pages/Purchaseorders/PurchaseordersDelete'
import { DeletePurchaseorders, handleDeletemodal, handleSelectedPurchaseorder } from "../../Redux/PurchaseorderSlice"

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Profile: state.Profile
})

const mapDispatchToProps = {
    handleSelectedPurchaseorder, DeletePurchaseorders, handleDeletemodal
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersDelete)