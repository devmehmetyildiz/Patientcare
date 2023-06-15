import { connect } from 'react-redux'
import PurchaseorderstockmovementsEdit from '../../Pages/Purchaseorderstockmovements/PurchaseorderstockmovementsEdit'
import { EditPurchaseorderstockmovements, GetPurchaseorderstockmovement, RemoveSelectedPurchaseorderstockmovement, removePurchaseorderstockmovementnotification, fillPurchaseorderstockmovementnotification } from '../../Redux/Reducers/PurchaseorderstockmovementReducer'
import { GetPurchaseorderstocks, removePurchaseorderstocknotification } from '../../Redux/Reducers/PurchaseorderstockReducer'


const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditPurchaseorderstockmovements, GetPurchaseorderstockmovement, RemoveSelectedPurchaseorderstockmovement,
    removePurchaseorderstockmovementnotification, fillPurchaseorderstockmovementnotification,GetPurchaseorderstocks, removePurchaseorderstocknotification 
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstockmovementsEdit)