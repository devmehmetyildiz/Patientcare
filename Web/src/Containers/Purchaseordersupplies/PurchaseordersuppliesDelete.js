import { connect } from 'react-redux'
import PurchaseordersuppliesDelete from '../../Pages/Purchaseordersupplies/PurchaseordersuppliesDelete'
import {
    DeletePurchaseorderstocks, handleDeletemodal, handleSelectedPurchaseorderstock
} from '../../Redux/PurchaseorderstockSlice'

const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePurchaseorderstocks, handleDeletemodal, handleSelectedPurchaseorderstock
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersuppliesDelete)