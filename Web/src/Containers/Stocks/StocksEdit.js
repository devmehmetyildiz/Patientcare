import { connect } from 'react-redux'
import StocksEdit from '../../Pages/Stocks/StocksEdit'
import { GetStock, EditStocks, removeStocknotification, fillStocknotification } from '../../Redux/Actions/StockAction'
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
  GetStock, EditStocks, removeStocknotification, fillStocknotification, GetStockdefines, removeStockdefinenotification,
  GetDepartments, removeDepartmentnotification, GetWarehouses, removeWarehousenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(StocksEdit)