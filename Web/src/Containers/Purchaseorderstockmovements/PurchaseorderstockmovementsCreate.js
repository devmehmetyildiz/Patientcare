import { connect } from 'react-redux'
import PurchaseorderstockmovementsCreate from '../../Pages/Purchaseorderstockmovements/PurchaseorderstockmovementsCreate'
import { GetPurchaseorderstocks, removePurchaseorderstocknotification } from '../../Redux/Actions/PurchaseorderstockAction'
import { AddPurchaseorderstockmovements, removePurchaseorderstockmovementnotification, fillPurchaseorderstockmovementnotification } from '../../Redux/Actions/PurchaseorderstockmovementAction'


const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements
})

const mapDispatchToProps = {
    GetPurchaseorderstocks, removePurchaseorderstocknotification, AddPurchaseorderstockmovements,
    removePurchaseorderstockmovementnotification, fillPurchaseorderstockmovementnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstockmovementsCreate)