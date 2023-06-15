import { connect } from 'react-redux'
import { GetStockmovements, GetStockmovement, fillStockmovementnotification, removeStockmovementnotification } from '../../Redux/Reducers/StockmovementReducer'
import { GetStocks, removeStocknotification } from '../../Redux/Reducers/StockReducer'
import Stockmovementsdetail from '../../Pages/Stocks/Stockmovementsdetail'

const mapStateToProps = (state) => ({
  Stockmovements: state.Stockmovements,
  Stocks: state.Stocks
})

const mapDispatchToProps = { GetStockmovements, GetStockmovement, fillStockmovementnotification, removeStockmovementnotification, GetStocks, removeStocknotification }

export default connect(mapStateToProps, mapDispatchToProps)(Stockmovementsdetail)