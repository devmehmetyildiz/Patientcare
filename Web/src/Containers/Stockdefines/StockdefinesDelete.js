import { connect } from 'react-redux'
import StockdefinesDelete from "../../Pages/Stockdefines/StockdefinesDelete"
import { DeleteStockdefines, handleDeletemodal, handleSelectedStockdefine } from "../../Redux/StockdefineSlice"

const mapStateToProps = (state) => ({
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteStockdefines, handleDeletemodal, handleSelectedStockdefine
}

export default connect(mapStateToProps, mapDispatchToProps)(StockdefinesDelete)