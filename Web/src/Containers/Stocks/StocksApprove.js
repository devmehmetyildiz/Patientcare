import { connect } from 'react-redux'
import StocksApprove from '../../Pages/Stocks/StocksApprove'
import { ApproveStocks, handleApprovemodal, handleSelectedStock } from "../../Redux/StockSlice"
import { GetStockdefines, removeStockdefinenotification } from "../../Redux/StockdefineSlice"

const mapStateToProps = (state) => ({
  Stocks: state.Stocks,
  Stockdefines: state.Stockdefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  ApproveStocks, handleApprovemodal, handleSelectedStock, GetStockdefines, removeStockdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(StocksApprove)