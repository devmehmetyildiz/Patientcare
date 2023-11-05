import { connect } from 'react-redux'
import StocksCreate from '../../Pages/Stocks/StocksCreate'
import { AddStocks,  fillStocknotification } from '../../Redux/StockSlice'
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
  AddStocks,  fillStocknotification, GetStockdefines,
  GetDepartments, GetWarehouses
}

export default connect(mapStateToProps, mapDispatchToProps)(StocksCreate)