import { connect } from 'react-redux'
import MedicinesApprove from '../../Pages/Medicines/MedicinesApprove'
import { ApproveStocks, handleApprovemodal, handleSelectedStock } from "../../Redux/StockSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"

const mapStateToProps = (state) => ({
  Stocks: state.Stocks,
  Stockdefines: state.Stockdefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  ApproveStocks, handleApprovemodal, handleSelectedStock, GetStockdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(MedicinesApprove)