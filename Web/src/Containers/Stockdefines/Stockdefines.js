import { connect } from 'react-redux'
import Stockdefines from "../../Pages/Stockdefines/Stockdefines"
import { GetStockdefines,  fillStockdefinenotification, DeleteStockdefines, handleDeletemodal, handleSelectedStockdefine } from "../../Redux/StockdefineSlice"
import { GetUnits } from "../../Redux/UnitSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Stocktypes: state.Stocktypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetStockdefines,  fillStockdefinenotification, DeleteStockdefines,
    handleDeletemodal, handleSelectedStockdefine, GetUnits,  GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(Stockdefines)