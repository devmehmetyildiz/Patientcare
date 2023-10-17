import { connect } from 'react-redux'
import Stockmovements from '../../Pages/Stockmovements/Stockmovements'
import {
    GetStockmovements, removeStockmovementnotification, handleApprovemodal,
    fillStockmovementnotification, DeleteStockmovements, handleDeletemodal, handleSelectedStockmovement
} from '../../Redux/StockmovementSlice'
import { GetUnits, removeUnitnotification } from '../../Redux/UnitSlice'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/StockdefineSlice'
import { GetStocks, removeStocknotification } from '../../Redux/StockSlice'

const mapStateToProps = (state) => ({
    Stockmovements: state.Stockmovements,
    Profile: state.Profile,
    Stocks: state.Stocks,
    Stockdefines: state.Stockdefines,
    Units: state.Units
})

const mapDispatchToProps = {
    GetStockmovements, removeStockmovementnotification, fillStockmovementnotification, DeleteStockmovements,
    handleDeletemodal, handleSelectedStockmovement, GetUnits, removeUnitnotification,
    GetStockdefines, removeStockdefinenotification,
    GetStocks, removeStocknotification,handleApprovemodal
}

export default connect(mapStateToProps, mapDispatchToProps)(Stockmovements)