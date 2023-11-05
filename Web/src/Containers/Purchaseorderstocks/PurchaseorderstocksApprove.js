import { connect } from 'react-redux'
import PurchaseorderstocksApprove from '../../Pages/Purchaseorderstocks/PurchaseorderstocksApprove'
import { ApprovePurchaseorderstocks, handleApprovemodal, handleSelectedPurchaseorderstock } from "../../Redux/PurchaseorderstockSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"

const mapStateToProps = (state) => ({
  Purchaseorderstocks: state.Purchaseorderstocks,
  Stockdefines: state.Stockdefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  ApprovePurchaseorderstocks, handleApprovemodal, handleSelectedPurchaseorderstock, GetStockdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstocksApprove)