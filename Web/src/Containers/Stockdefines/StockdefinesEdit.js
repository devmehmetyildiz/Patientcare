import { connect } from 'react-redux'
import StockdefinesEdit from '../../Pages/Stockdefines/StockdefinesEdit'
import { EditStockdefines, GetStockdefine, RemoveSelectedStockdefine, fillStockdefinenotification, removeStockdefinenotification } from '../../Redux/Reducers/StockdefineReducer'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/Reducers/DepartmentReducer'
import { GetUnits, removeUnitnotification } from '../../Redux/Reducers/UnitReducer'

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