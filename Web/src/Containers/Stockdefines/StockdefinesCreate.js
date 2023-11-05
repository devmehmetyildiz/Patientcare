import { connect } from 'react-redux'
import StockdefinesCreate from '../../Pages/Stockdefines/StockdefinesCreate'
import { AddStockdefines, fillStockdefinenotification } from '../../Redux/StockdefineSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { GetUnits } from '../../Redux/UnitSlice'

const mapStateToProps = (state) => ({
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = { AddStockdefines,  fillStockdefinenotification, GetDepartments, GetUnits }

export default connect(mapStateToProps, mapDispatchToProps)(StockdefinesCreate)