import { connect } from 'react-redux'
import Medicines from '../../Pages/Medicines/Medicines'
import { GetStocks, DeleteStocks, DeactivateStocks, fillStocknotification, handleDeletemodal, handleSelectedStock, handleApprovemodal } from "../../Redux/StockSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetStockmovements } from "../../Redux/StockmovementSlice"
import { GetWarehouses } from "../../Redux/WarehouseSlice"

const mapStateToProps = (state) => ({
  Stocks: state.Stocks,
  Profile: state.Profile,
  Departments: state.Departments,
  Stockdefines: state.Stockdefines,
  Stockmovements: state.Stockmovements,
  Warehouses: state.Warehouses,
})

const mapDispatchToProps = {
  GetStocks, DeleteStocks, DeactivateStocks,  GetWarehouses,
  fillStocknotification, handleDeletemodal, handleSelectedStock, GetStockmovements,
  GetStockdefines, GetDepartments, handleApprovemodal
}

export default connect(mapStateToProps, mapDispatchToProps)(Medicines)