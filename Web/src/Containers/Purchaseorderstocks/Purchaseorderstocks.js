import { connect } from 'react-redux'
import Purchaseorderstocks from '../../Pages/Purchaseorderstocks/Purchaseorderstocks'
import { GetPurchaseorderstocks, removePurchaseorderstocknotification, fillPurchaseorderstocknotification, DeletePurchaseorderstocks } from '../../Redux/PurchaseorderstockSlice'



const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPurchaseorderstocks, removePurchaseorderstocknotification, fillPurchaseorderstocknotification, DeletePurchaseorderstocks
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchaseorderstocks)