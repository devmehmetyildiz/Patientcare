import { connect } from 'react-redux'
import Stocks from '../../Pages/Stocks/Stocks'
import { GetStocks, DeleteStocks, DeactivateStocks, fillStocknotification, handleDeletemodal, handleSelectedStock, handleApprovemodal } from "../../Redux/StockSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetStockmovements } from "../../Redux/StockmovementSlice"
import { GetWarehouses } from "../../Redux/WarehouseSlice"
import { GetUnits } from "../../Redux/UnitSlice"
import { GetStocktypes } from "../../Redux/StocktypeSlice"

const mapStateToProps = (state) => ({
  Stocks: state.Stocks,
  Profile: state.Profile,
  Departments: state.Departments,
  Stockdefines: state.Stockdefines,
  Stockmovements: state.Stockmovements,
  Warehouses: state.Warehouses,
  Units: state.Units,
  Stocktypes: state.Stocktypes,
})

const mapDispatchToProps = {
  GetStocks, DeleteStocks, DeactivateStocks, GetWarehouses,
  fillStocknotification, handleDeletemodal, handleSelectedStock, GetStockmovements,
  GetStockdefines, GetDepartments, handleApprovemodal, GetUnits, GetStocktypes
}

export default connect(mapStateToProps, mapDispatchToProps)(Stocks)