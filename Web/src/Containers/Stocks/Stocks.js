import { connect } from 'react-redux'
import Stocks from '../../Pages/Stocks/Stocks'
import { GetStocks, DeleteStocks, DeactivateStocks, removeStocknotification, fillStocknotification, handleDeletemodal, handleSelectedStock } from "../../Redux/StockSlice"

const mapStateToProps = (state) => ({
  Stocks: state.Stocks,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetStocks, DeleteStocks, DeactivateStocks, removeStocknotification, fillStocknotification, handleDeletemodal, handleSelectedStock
}

export default connect(mapStateToProps, mapDispatchToProps)(Stocks)