import { connect } from 'react-redux'
import StocksCreate from '../../Pages/Stocks/StocksCreate'
import { AddStocks, fillStocknotification } from '../../Redux/StockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetWarehouses } from '../../Redux/WarehouseSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'
import { GetStocktypegroups } from '../../Redux/StocktypegroupSlice'

const mapStateToProps = (state) => ({
  Stockdefines: state.Stockdefines,
  Stocks: state.Stocks,
  Stocktypes: state.Stocktypes,
  Warehouses: state.Warehouses,
  Stocktypegroups: state.Stocktypegroups,
  Profile: state.Profile
})

const mapDispatchToProps = {
  AddStocks, fillStocknotification, GetStockdefines, GetWarehouses, GetStocktypes, GetStocktypegroups
}

export default connect(mapStateToProps, mapDispatchToProps)(StocksCreate)