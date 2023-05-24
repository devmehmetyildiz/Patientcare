import { connect } from 'react-redux'
import PurchaseorderstockmovementsEdit from '../../Pages/Purchaseorderstockmovements/PurchaseorderstockmovementsEdit'
import { EditPurchaseorderstockmovements, GetPurchaseorderstockmovement, RemoveSelectedPurchaseorderstockmovement, removePurchaseorderstockmovementnotification, fillPurchaseorderstockmovementnotification } from '../../Redux/Actions/PurchaseorderstockmovementAction'
import { GetPurchaseorderstocks, removePurchaseorderstocknotification } from '../../Redux/Actions/PurchaseorderstockAction'


const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements
})

const mapDispatchToProps = {
    EditPurchaseorderstockmovements, GetPurchaseorderstockmovement, RemoveSelectedPurchaseorderstockmovement,
    removePurchaseorderstockmovementnotification, fillPurchaseorderstockmovementnotification,GetPurchaseorderstocks, removePurchaseorderstocknotification 
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstockmovementsEdit)