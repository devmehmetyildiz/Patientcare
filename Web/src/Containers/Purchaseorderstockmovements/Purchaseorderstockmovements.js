import { connect } from 'react-redux'
import Purchaseorderstockmovements from '../../Pages/Purchaseorderstockmovements/Purchaseorderstockmovements'
import {
    GetPurchaseorderstockmovements, handleApprovemodal,
    fillPurchaseorderstockmovementnotification, DeletePurchaseorderstockmovements, handleDeletemodal, handleSelectedPurchaseorderstockmovement
} from '../../Redux/PurchaseorderstockmovementSlice'
import { GetUnits } from '../../Redux/UnitSlice'
import { GetPurchaseorderstocks } from '../../Redux/PurchaseorderstockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'

const mapStateToProps = (state) => ({
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Profile: state.Profile,
    Units: state.Units,
    Purchaseorderstocks: state.Purchaseorderstocks,
    Stockdefines: state.Stockdefines
})

const mapDispatchToProps = {
    GetPurchaseorderstockmovements, GetUnits, GetPurchaseorderstocks, handleApprovemodal,
    handleDeletemodal, handleSelectedPurchaseorderstockmovement, fillPurchaseorderstockmovementnotification, DeletePurchaseorderstockmovements,
    GetStockdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchaseorderstockmovements)