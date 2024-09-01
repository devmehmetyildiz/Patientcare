import { connect } from 'react-redux'
import Stockmovements from '../../Pages/Stockmovements/Stockmovements'
import {
    GetStockmovements, handleApprovemodal,
    fillStockmovementnotification, DeleteStockmovements, handleDeletemodal, handleSelectedStockmovement
} from '../../Redux/StockmovementSlice'
import { GetUnits } from '../../Redux/UnitSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetStocks } from '../../Redux/StockSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'

const mapStateToProps = (state) => ({
    Stockmovements: state.Stockmovements,
    Stocks: state.Stocks,
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Stocktypes: state.Stocktypes,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetStockmovements, fillStockmovementnotification, DeleteStockmovements,
    handleDeletemodal, handleSelectedStockmovement, GetUnits, GetStockdefines,
    GetStocks, handleApprovemodal, GetStocktypes
}

export default connect(mapStateToProps, mapDispatchToProps)(Stockmovements)