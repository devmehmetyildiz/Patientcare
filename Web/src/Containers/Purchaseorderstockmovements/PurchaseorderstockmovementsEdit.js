import { connect } from 'react-redux'
import PurchaseorderstockmovementsEdit from '../../Pages/Purchaseorderstockmovements/PurchaseorderstockmovementsEdit'
import { EditPurchaseorderstockmovements, GetPurchaseorderstockmovement, handleSelectedPurchaseorderstockmovement, removePurchaseorderstockmovementnotification, fillPurchaseorderstockmovementnotification } from '../../Redux/PurchaseorderstockmovementSlice'
import { GetPurchaseorderstocks, removePurchaseorderstocknotification } from '../../Redux/PurchaseorderstockSlice'


const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditPurchaseorderstockmovements, GetPurchaseorderstockmovement, handleSelectedPurchaseorderstockmovement,
    removePurchaseorderstockmovementnotification, fillPurchaseorderstockmovementnotification,GetPurchaseorderstocks, removePurchaseorderstocknotification 
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstockmovementsEdit)