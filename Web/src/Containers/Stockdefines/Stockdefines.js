import { connect } from 'react-redux'
import Stockdefines from "../../Pages/Stockdefines/Stockdefines"
import { GetStockdefines, removeStockdefinenotification, fillStockdefinenotification, DeleteStockdefines, handleDeletemodal, handleSelectedStockdefine } from "../../Redux/StockdefineSlice"
import { GetUnits, removeUnitnotification } from "../../Redux/UnitSlice"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetStockdefines, removeStockdefinenotification, fillStockdefinenotification, DeleteStockdefines,
    handleDeletemodal, handleSelectedStockdefine, GetUnits, removeUnitnotification, GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Stockdefines)