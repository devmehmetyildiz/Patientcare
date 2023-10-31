import { connect } from 'react-redux'
import PurchaseordermedicinesApprove from '../../Pages/Purchaseordermedicines/PurchaseordermedicinesApprove'
import { ApprovePurchaseorderstocks, handleApprovemodal, handleSelectedPurchaseorderstock } from "../../Redux/PurchaseorderstockSlice"
import { GetStockdefines, removeStockdefinenotification } from "../../Redux/StockdefineSlice"

const mapStateToProps = (state) => ({
  Purchaseorderstocks: state.Purchaseorderstocks,
  Stockdefines: state.Stockdefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  ApprovePurchaseorderstocks, handleApprovemodal, handleSelectedPurchaseorderstock, GetStockdefines, removeStockdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordermedicinesApprove)