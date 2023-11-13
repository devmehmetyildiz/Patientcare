import { connect } from 'react-redux'
import PurchaseorderstockmovementsApprove from '../../Pages/Purchaseorderstockmovements/PurchaseorderstockmovementsApprove'
import { ApprovePurchaseorderstockmovements, handleSelectedPurchaseorderstockmovement, handleApprovemodal } from '../../Redux/PurchaseorderstockmovementSlice'

const mapStateToProps = (state) => ({
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Purchaseorderstocks: state.Purchaseorderstocks,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApprovePurchaseorderstockmovements, handleSelectedPurchaseorderstockmovement, handleApprovemodal
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstockmovementsApprove)