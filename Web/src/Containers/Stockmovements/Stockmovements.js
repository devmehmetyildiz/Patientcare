import { connect } from 'react-redux'
import Stockmovements from '../../Pages/Stockmovements/Stockmovements'
import {
    GetStockmovements, handleApprovemodal,
    fillStockmovementnotification, DeleteStockmovements, handleDeletemodal, handleSelectedStockmovement
} from '../../Redux/StockmovementSlice'
import { GetUnits } from '../../Redux/UnitSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetStocks } from '../../Redux/StockSlice'

const mapStateToProps = (state) => ({
    Stockmovements: state.Stockmovements,
    Profile: state.Profile,
    Stocks: state.Stocks,
    Stockdefines: state.Stockdefines,
    Units: state.Units
})

const mapDispatchToProps = {
    GetStockmovements, fillStockmovementnotification, DeleteStockmovements,
    handleDeletemodal, handleSelectedStockmovement, GetUnits, GetStockdefines,
    GetStocks, handleApprovemodal
}

export default connect(mapStateToProps, mapDispatchToProps)(Stockmovements)