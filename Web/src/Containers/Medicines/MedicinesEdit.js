import { connect } from 'react-redux'
import MedicinesEdit from '../../Pages/Medicines/MedicinesEdit'
import { GetStock, EditStocks, fillStocknotification } from '../../Redux/StockSlice'
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
  GetStock, EditStocks, fillStocknotification, GetStockdefines,
  GetDepartments, GetWarehouses
}

export default connect(mapStateToProps, mapDispatchToProps)(MedicinesEdit)