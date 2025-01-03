import { connect } from 'react-redux'
import PurchaseordersDelete from "../../Pages/Purchaseorders/PurchaseordersDelete"
import { DeletePurchaseorders } from "../../Redux/PurchaseorderSlice"

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePurchaseorders, 
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersDelete)