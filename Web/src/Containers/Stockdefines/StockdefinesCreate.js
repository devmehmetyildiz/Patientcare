import { connect } from 'react-redux'
import StockdefinesCreate from '../../Pages/Stockdefines/StockdefinesCreate'
import { AddStockdefines, removeStockdefinenotification, fillStockdefinenotification } from '../../Redux/Actions/StockdefineAction'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/Actions/DepartmentAction'
import { GetUnits, removeUnitnotification } from '../../Redux/Actions/UnitActions'

const mapStateToProps = (state) => ({
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = { AddStockdefines, removeStockdefinenotification, fillStockdefinenotification, GetDepartments, GetUnits, removeUnitnotification, removeDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(StockdefinesCreate)