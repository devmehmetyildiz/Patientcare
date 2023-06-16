import { connect } from 'react-redux'
import PurchaseorderstockmovementsCreate from '../../Pages/Purchaseorderstockmovements/PurchaseorderstockmovementsCreate'
import { GetPurchaseorderstocks, removePurchaseorderstocknotification } from '../../Redux/PurchaseorderstockSlice'
import { AddPurchaseorderstockmovements, removePurchaseorderstockmovementnotification, fillPurchaseorderstockmovementnotification } from '../../Redux/PurchaseorderstockmovementSlice'


const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPurchaseorderstocks, removePurchaseorderstocknotification, AddPurchaseorderstockmovements,
    removePurchaseorderstockmovementnotification, fillPurchaseorderstockmovementnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstockmovementsCreate)