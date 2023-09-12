import { connect } from 'react-redux'
import Purchaseorderstockmovements from '../../Pages/Purchaseorderstockmovements/Purchaseorderstockmovements'
import {
    GetPurchaseorderstockmovements, removePurchaseorderstockmovementnotification,
    fillPurchaseorderstockmovementnotification, DeletePurchaseorderstockmovements, handleDeletemodal, handleSelectedPurchaseorderstockmovement
} from '../../Redux/PurchaseorderstockmovementSlice'
import { GetUnits, removeUnitnotification } from '../../Redux/UnitSlice'
import { GetPurchaseorderstocks, removePurchaseorderstocknotification } from '../../Redux/PurchaseorderstockSlice'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/StockdefineSlice'

const mapStateToProps = (state) => ({
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Profile: state.Profile,
    Units: state.Units,
    Purchaseorderstocks: state.Purchaseorderstocks,
    Stockdefines: state.Stockdefines
})

const mapDispatchToProps = {
    GetPurchaseorderstockmovements, removePurchaseorderstockmovementnotification, GetUnits, removeUnitnotification, GetPurchaseorderstocks, removePurchaseorderstocknotification,
    handleDeletemodal, handleSelectedPurchaseorderstockmovement, fillPurchaseorderstockmovementnotification, DeletePurchaseorderstockmovements,
    GetStockdefines, removeStockdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchaseorderstockmovements)