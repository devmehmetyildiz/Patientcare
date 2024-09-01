import { connect } from 'react-redux'
import StockmovementsCreate from '../../Pages/Stockmovements/StockmovementsCreate'
import { GetStocks } from '../../Redux/StockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'
import { AddStockmovements, fillStockmovementnotification } from '../../Redux/StockmovementSlice'


const mapStateToProps = (state) => ({
    Stocks: state.Stocks,
    Stockmovements: state.Stockmovements,
    Stockdefines: state.Stockdefines,
    Stocktypes: state.Stocktypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetStocks, AddStockmovements,
    fillStockmovementnotification,
    GetStockdefines, GetStocktypes
}

export default connect(mapStateToProps, mapDispatchToProps)(StockmovementsCreate)