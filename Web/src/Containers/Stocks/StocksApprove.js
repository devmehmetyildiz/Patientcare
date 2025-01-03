import { connect } from 'react-redux'
import StocksApprove from '../../Pages/Stocks/StocksApprove'
import { ApproveStocks, } from "../../Redux/StockSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"

const mapStateToProps = (state) => ({
  Stocks: state.Stocks,
  Stockdefines: state.Stockdefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  ApproveStocks,  GetStockdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(StocksApprove)