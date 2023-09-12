import { connect } from 'react-redux'
import Warehouses from '../../Pages/Warehouses/Warehouses'
import { GetWarehouses, removeWarehousenotification, fillWarehousenotification, DeleteWarehouses, handleDeletemodal, handleSelectedWarehouse } from '../../Redux/WarehouseSlice'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/DepartmentSlice'
import { GetUnits, removeUnitnotification } from '../../Redux/UnitSlice'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/StockdefineSlice'
import { GetStockmovements, removeStockmovementnotification } from '../../Redux/StockmovementSlice'
import { GetStocks, removeStocknotification } from '../../Redux/StockSlice'

const mapStateToProps = (state) => ({
    Warehouses: state.Warehouses,
    Profile: state.Profile,
    Departments: state.Departments,
    Units: state.Units,
    Stockdefines: state.Stockdefines,
    Stockmovements: state.Stockmovements,
    Stocks: state.Stocks,
})

const mapDispatchToProps = {
    GetWarehouses, removeWarehousenotification, fillWarehousenotification,
    DeleteWarehouses, handleDeletemodal, handleSelectedWarehouse,
    GetDepartments, removeDepartmentnotification,
    GetUnits, removeUnitnotification,
    GetStockdefines, removeStockdefinenotification,
    GetStockmovements, removeStockmovementnotification,
    GetStocks, removeStocknotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Warehouses)