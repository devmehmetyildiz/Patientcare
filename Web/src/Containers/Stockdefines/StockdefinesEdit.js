import { connect } from 'react-redux'
import StockdefinesEdit from '../../Pages/Stockdefines/StockdefinesEdit'
import { EditStockdefines, GetStockdefine, RemoveSelectedStockdefine, fillStockdefinenotification, removeStockdefinenotification } from '../../Redux/StockdefineSlice'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/DepartmentSlice'
import { GetUnits, removeUnitnotification } from '../../Redux/UnitSlice'

const mapStateToProps = (state) => ({
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditStockdefines, GetStockdefine, RemoveSelectedStockdefine, fillStockdefinenotification, GetDepartments, GetUnits
    , removeDepartmentnotification, removeStockdefinenotification, removeUnitnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(StockdefinesEdit)