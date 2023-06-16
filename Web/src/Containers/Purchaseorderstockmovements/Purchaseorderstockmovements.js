import { connect } from 'react-redux'
import Purchaseorderstockmovements from '../../Pages/Purchaseorderstockmovements/Purchaseorderstockmovements'
import {
    GetPurchaseorderstockmovements, removePurchaseorderstockmovementnotification,
    fillPurchaseorderstockmovementnotification, DeletePurchaseorderstockmovements, handleDeletemodal, handleSelectedPurchaseorderstockmovement
} from '../../Redux/PurchaseorderstockmovementSlice'


const mapStateToProps = (state) => ({
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPurchaseorderstockmovements, removePurchaseorderstockmovementnotification,
    handleDeletemodal, handleSelectedPurchaseorderstockmovement, fillPurchaseorderstockmovementnotification, DeletePurchaseorderstockmovements,
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchaseorderstockmovements)