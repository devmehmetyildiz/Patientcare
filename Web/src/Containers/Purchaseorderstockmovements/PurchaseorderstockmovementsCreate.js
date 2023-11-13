import { connect } from 'react-redux'
import PurchaseorderstockmovementsCreate from '../../Pages/Purchaseorderstockmovements/PurchaseorderstockmovementsCreate'
import { GetPurchaseorderstocks } from '../../Redux/PurchaseorderstockSlice'
import { AddPurchaseorderstockmovements, fillPurchaseorderstockmovementnotification } from '../../Redux/PurchaseorderstockmovementSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'


const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPurchaseorderstocks, AddPurchaseorderstockmovements,
    fillPurchaseorderstockmovementnotification, GetStockdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstockmovementsCreate)