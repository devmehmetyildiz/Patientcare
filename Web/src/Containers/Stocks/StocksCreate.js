import { connect } from 'react-redux'
import StocksCreate from '../../Pages/Stocks/StocksCreate'
import { AddStocks, removeStocknotification, fillStocknotification } from '../../Redux/Reducers/StockReducer'
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
  AddStocks, removeStocknotification, fillStocknotification, GetStockdefines, removeStockdefinenotification,
  GetDepartments, removeDepartmentnotification, GetWarehouses, removeWarehousenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(StocksCreate)