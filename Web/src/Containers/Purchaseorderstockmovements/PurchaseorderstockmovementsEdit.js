import { connect } from 'react-redux'
import PurchaseorderstockmovementsEdit from '../../Pages/Purchaseorderstockmovements/PurchaseorderstockmovementsEdit'
import { EditPurchaseorderstockmovements, GetPurchaseorderstockmovement, handleSelectedPurchaseorderstockmovement, fillPurchaseorderstockmovementnotification } from '../../Redux/PurchaseorderstockmovementSlice'
import { GetPurchaseorderstocks } from '../../Redux/PurchaseorderstockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'


const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditPurchaseorderstockmovements, GetPurchaseorderstockmovement, handleSelectedPurchaseorderstockmovement,
    fillPurchaseorderstockmovementnotification, GetPurchaseorderstocks, GetStockdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstockmovementsEdit)