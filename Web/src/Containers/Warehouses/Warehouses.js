import { connect } from 'react-redux'
import Warehouses from '../../Pages/Warehouses/Warehouses'
import { GetWarehouses,  fillWarehousenotification, DeleteWarehouses, handleDeletemodal, handleSelectedWarehouse } from '../../Redux/WarehouseSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { GetUnits } from '../../Redux/UnitSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetStockmovements } from '../../Redux/StockmovementSlice'
import { GetStocks } from '../../Redux/StockSlice'

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
    GetWarehouses, fillWarehousenotification,
    DeleteWarehouses, handleDeletemodal, handleSelectedWarehouse,
    GetDepartments, GetUnits, GetStockdefines,
    GetStockmovements,  GetStocks
}

export default connect(mapStateToProps, mapDispatchToProps)(Warehouses)