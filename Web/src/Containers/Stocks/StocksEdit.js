import { connect } from 'react-redux'
import StocksEdit from '../../Pages/Stocks/StocksEdit'
import { GetStock, EditStocks, fillStocknotification } from '../../Redux/StockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetWarehouses } from '../../Redux/WarehouseSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'
import { GetStocktypegroups } from '../../Redux/StocktypegroupSlice'

const mapStateToProps = (state) => ({
  Stockdefines: state.Stockdefines,
  Stocks: state.Stocks,
  Warehouses: state.Warehouses,
  Stocktypes: state.Stocktypes,
  Stocktypegroups: state.Stocktypegroups,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetStock, EditStocks, fillStocknotification, GetStockdefines,
  GetWarehouses, GetStocktypes, GetStocktypegroups
}

export default connect(mapStateToProps, mapDispatchToProps)(StocksEdit)