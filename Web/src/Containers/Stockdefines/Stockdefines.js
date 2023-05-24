import { connect } from 'react-redux'
import Stockdefines from "../../Pages/Stockdefines/Stockdefines"
import { GetStockdefines, removeStockdefinenotification, fillStockdefinenotification, DeleteStockdefines } from "../../Redux/Actions/StockdefineAction"

const mapStateToProps = (state) => ({
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = { GetStockdefines, removeStockdefinenotification, fillStockdefinenotification, DeleteStockdefines }

export default connect(mapStateToProps, mapDispatchToProps)(Stockdefines)