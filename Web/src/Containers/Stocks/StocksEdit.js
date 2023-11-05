import { connect } from 'react-redux'
import StocksEdit from '../../Pages/Stocks/StocksEdit'
import { GetStock, EditStocks,  fillStocknotification } from '../../Redux/StockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { GetWarehouses } from '../../Redux/WarehouseSlice'

const mapStateToProps = (state) => ({
  Stockdefines: state.Stockdefines,
  Departments: state.Departments,
  Stocks: state.Stocks,
  Warehouses: state.Warehouses,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetStock, EditStocks,  fillStocknotification, GetStockdefines,
  GetDepartments,  GetWarehouses
}

export default connect(mapStateToProps, mapDispatchToProps)(StocksEdit)