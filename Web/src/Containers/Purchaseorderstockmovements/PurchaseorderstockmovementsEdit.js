import { connect } from 'react-redux'
import PurchaseorderstockmovementsEdit from '../../Pages/Purchaseorderstockmovements/PurchaseorderstockmovementsEdit'
import { EditPurchaseorderstockmovements, GetPurchaseorderstockmovement, handleSelectedPurchaseorderstockmovement, fillPurchaseorderstockmovementnotification } from '../../Redux/PurchaseorderstockmovementSlice'
import { GetPurchaseorderstocks } from '../../Redux/PurchaseorderstockSlice'


const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditPurchaseorderstockmovements, GetPurchaseorderstockmovement, handleSelectedPurchaseorderstockmovement,
    fillPurchaseorderstockmovementnotification, GetPurchaseorderstocks
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstockmovementsEdit)