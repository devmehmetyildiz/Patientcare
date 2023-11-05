import { connect } from 'react-redux'
import PurchaseorderstockmovementsCreate from '../../Pages/Purchaseorderstockmovements/PurchaseorderstockmovementsCreate'
import { GetPurchaseorderstocks } from '../../Redux/PurchaseorderstockSlice'
import { AddPurchaseorderstockmovements, fillPurchaseorderstockmovementnotification } from '../../Redux/PurchaseorderstockmovementSlice'


const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPurchaseorderstocks,  AddPurchaseorderstockmovements,
     fillPurchaseorderstockmovementnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstockmovementsCreate)