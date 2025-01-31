import { connect } from 'react-redux'
import Warehouses from '../../Pages/Warehouses/Warehouses'
import { GetWarehouses, fillWarehousenotification, } from '../../Redux/WarehouseSlice'
import { GetUnits } from '../../Redux/UnitSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetStockmovements } from '../../Redux/StockmovementSlice'
import { GetStocks } from '../../Redux/StockSlice'
import { GetStocktypegroups } from '../../Redux/StocktypegroupSlice'

const mapStateToProps = (state) => ({
    Warehouses: state.Warehouses,
    Profile: state.Profile,
    Units: state.Units,
    Stockdefines: state.Stockdefines,
    Stockmovements: state.Stockmovements,
    Stocks: state.Stocks,
    Stocktypegroups: state.Stocktypegroups,
})

const mapDispatchToProps = {
    GetWarehouses, fillWarehousenotification,
    GetUnits, GetStockdefines,
    GetStockmovements, GetStocks, GetStocktypegroups
}

export default connect(mapStateToProps, mapDispatchToProps)(Warehouses)