import { connect } from 'react-redux'
import StocksDelete from '../../Pages/Stocks/StocksDelete'
import { DeleteStocks, handleDeletemodal, handleSelectedStock } from "../../Redux/StockSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"

const mapStateToProps = (state) => ({
  Stocks: state.Stocks,
  Stockdefines: state.Stockdefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  DeleteStocks, handleDeletemodal, handleSelectedStock, GetStockdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(StocksDelete)