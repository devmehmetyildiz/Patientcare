import { connect } from 'react-redux'
import PurchaseordersuppliesApprove from '../../Pages/Purchaseordersupplies/PurchaseordersuppliesApprove'
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

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersuppliesApprove)