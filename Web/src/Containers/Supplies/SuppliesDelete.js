import { connect } from 'react-redux'
import SuppliesDelete from '../../Pages/Supplies/SuppliesDelete'
import { DeleteStocks, handleDeletemodal, handleSelectedStock } from "../../Redux/StockSlice"
import { GetStockdefines, removeStockdefinenotification } from "../../Redux/StockdefineSlice"

const mapStateToProps = (state) => ({
  Stocks: state.Stocks,
  Stockdefines: state.Stockdefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  DeleteStocks, handleDeletemodal, handleSelectedStock, GetStockdefines, removeStockdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(SuppliesDelete)