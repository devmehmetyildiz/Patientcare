import { connect } from 'react-redux'
import Stocks from '../../Pages/Stocks/Stocks'
import { GetStocks, DeleteStocks, DeactivateStocks, removeStocknotification, fillStocknotification } from "../../Redux/Actions/StockAction"

const mapStateToProps = (state) => ({
  Stocks: state.Stocks,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetStocks, DeleteStocks, DeactivateStocks, removeStocknotification, fillStocknotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Stocks)