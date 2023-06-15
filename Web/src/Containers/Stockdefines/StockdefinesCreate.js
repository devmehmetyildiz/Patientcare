import { connect } from 'react-redux'
import StockdefinesCreate from '../../Pages/Stockdefines/StockdefinesCreate'
import { AddStockdefines, removeStockdefinenotification, fillStockdefinenotification } from '../../Redux/Reducers/StockdefineReducer'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/Reducers/DepartmentReducer'
import { GetUnits, removeUnitnotification } from '../../Redux/Reducers/UnitReducer'

const mapStateToProps = (state) => ({
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = { AddStockdefines, removeStockdefinenotification, fillStockdefinenotification, GetDepartments, GetUnits, removeUnitnotification, removeDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(StockdefinesCreate)