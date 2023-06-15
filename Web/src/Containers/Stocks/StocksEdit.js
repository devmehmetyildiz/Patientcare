import { connect } from 'react-redux'
import StocksEdit from '../../Pages/Stocks/StocksEdit'
import { GetStock, EditStocks, removeStocknotification, fillStocknotification } from '../../Redux/Reducers/StockReducer'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/Reducers/StockdefineReducer'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/Reducers/DepartmentReducer'
import { GetWarehouses, removeWarehousenotification } from '../../Redux/Reducers/WarehouseReducer'

const mapStateToProps = (state) => ({
  Stockdefines: state.Stockdefines,
  Departments: state.Departments,
  Stocks: state.Stocks,
  Warehouses: state.Warehouses,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetStock, EditStocks, removeStocknotification, fillStocknotification, GetStockdefines, removeStockdefinenotification,
  GetDepartments, removeDepartmentnotification, GetWarehouses, removeWarehousenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(StocksEdit)