import { connect } from 'react-redux'
import StocksCreate from '../../Pages/Stocks/StocksCreate'
import { AddStocks, removeStocknotification, fillStocknotification } from '../../Redux/Actions/StockAction'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/Actions/StockdefineAction'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/Actions/DepartmentAction'
import { GetWarehouses, removeWarehousenotification } from '../../Redux/Actions/WarehouseAction'

const mapStateToProps = (state) => ({
  Stockdefines: state.Stockdefines,
  Departments: state.Departments,
  Stocks: state.Stocks,
  Warehouses: state.Warehouses
})

const mapDispatchToProps = {
  AddStocks, removeStocknotification, fillStocknotification, GetStockdefines, removeStockdefinenotification,
  GetDepartments, removeDepartmentnotification, GetWarehouses, removeWarehousenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(StocksCreate)