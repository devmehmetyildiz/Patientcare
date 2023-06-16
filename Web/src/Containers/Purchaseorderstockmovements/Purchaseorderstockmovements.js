import { connect } from 'react-redux'
import Purchaseorderstockmovements from '../../Pages/Purchaseorderstockmovements/Purchaseorderstockmovements'
import {
    GetPurchaseorderstockmovements, removePurchaseorderstockmovementnotification,
    fillPurchaseorderstockmovementnotification, DeletePurchaseorderstockmovements
} from '../../Redux/PurchaseorderstockmovementSlice'


const mapStateToProps = (state) => ({
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPurchaseorderstockmovements, removePurchaseorderstockmovementnotification, fillPurchaseorderstockmovementnotification, DeletePurchaseorderstockmovements,
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchaseorderstockmovements)