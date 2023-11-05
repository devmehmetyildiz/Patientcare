import { connect } from 'react-redux'
import StockdefinesEdit from '../../Pages/Stockdefines/StockdefinesEdit'
import { EditStockdefines, GetStockdefine, handleSelectedStockdefine, fillStockdefinenotification } from '../../Redux/StockdefineSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { GetUnits } from '../../Redux/UnitSlice'

const mapStateToProps = (state) => ({
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditStockdefines, GetStockdefine, handleSelectedStockdefine, fillStockdefinenotification, GetDepartments, GetUnits
}

export default connect(mapStateToProps, mapDispatchToProps)(StockdefinesEdit)