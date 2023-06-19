import { connect } from 'react-redux'
import StocksDelete from '../../Pages/Stocks/StocksDelete'
import { DeleteStocks,  handleDeletemodal, handleSelectedStock } from "../../Redux/StockSlice"

const mapStateToProps = (state) => ({
  Stocks: state.Stocks,
  Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteStocks,  handleDeletemodal, handleSelectedStock
}

export default connect(mapStateToProps, mapDispatchToProps)(StocksDelete)