import { connect } from 'react-redux'
import PurchaseorderPrepare from "../../Pages/Purchaseorders/PurchaseorderPrepare"

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Profile: state.Profile
})

const mapDispatchToProps = {
   
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderPrepare)