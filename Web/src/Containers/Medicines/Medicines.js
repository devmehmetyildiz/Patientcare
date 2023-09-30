import { connect } from 'react-redux'
import Medicines from '../../Pages/Medicines/Medicines'
import { GetStocks, DeleteStocks, DeactivateStocks, removeStocknotification, fillStocknotification, handleDeletemodal, handleSelectedStock } from "../../Redux/StockSlice"
import { GetStockdefines, removeStockdefinenotification } from "../../Redux/StockdefineSlice"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/DepartmentSlice"
import { GetStockmovements, removeStockmovementnotification } from "../../Redux/StockmovementSlice"
import { GetWarehouses, removeWarehousenotification } from "../../Redux/WarehouseSlice"

const mapStateToProps = (state) => ({
  Stocks: state.Stocks,
  Profile: state.Profile,
  Departments: state.Departments,
  Stockdefines: state.Stockdefines,
  Stockmovements: state.Stockmovements,
  Warehouses: state.Warehouses,
})

const mapDispatchToProps = {
  GetStocks, DeleteStocks, DeactivateStocks, removeStocknotification, GetWarehouses, removeWarehousenotification,
  fillStocknotification, handleDeletemodal, handleSelectedStock, GetStockmovements, removeStockmovementnotification,
  GetStockdefines, removeStockdefinenotification, GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Medicines)