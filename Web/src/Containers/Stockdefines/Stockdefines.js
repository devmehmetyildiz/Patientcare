import { connect } from 'react-redux'
import Stockdefines from "../../Pages/Stockdefines/Stockdefines"
import { GetStockdefines, removeStockdefinenotification, fillStockdefinenotification, DeleteStockdefines, handleDeletemodal, handleSelectedStockdefine } from "../../Redux/StockdefineSlice"

const mapStateToProps = (state) => ({
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetStockdefines, removeStockdefinenotification, fillStockdefinenotification, DeleteStockdefines,
    handleDeletemodal, handleSelectedStockdefine
}

export default connect(mapStateToProps, mapDispatchToProps)(Stockdefines)