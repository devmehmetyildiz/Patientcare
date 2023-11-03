import { connect } from 'react-redux'
import Supplies from '../../Pages/Supplies/Supplies'
import { GetStocks, DeleteStocks, DeactivateStocks, removeStocknotification, fillStocknotification, handleDeletemodal, handleSelectedStock, handleApprovemodal } from "../../Redux/StockSlice"
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
  GetStockdefines, removeStockdefinenotification, GetDepartments, removeDepartmentnotification, handleApprovemodal
}

export default connect(mapStateToProps, mapDispatchToProps)(Supplies)