import { connect } from 'react-redux'
import SuppliesApprove from '../../Pages/Supplies/SuppliesApprove'
import { ApproveStocks, handleApprovemodal, handleSelectedStock } from "../../Redux/StockSlice"
import { GetStockdefines, removeStockdefinenotification } from "../../Redux/StockdefineSlice"

const mapStateToProps = (state) => ({
  Stocks: state.Stocks,
  Stockdefines: state.Stockdefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  ApproveStocks, handleApprovemodal, handleSelectedStock, GetStockdefines, removeStockdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(SuppliesApprove)