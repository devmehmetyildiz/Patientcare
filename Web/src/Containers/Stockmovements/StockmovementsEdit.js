import { connect } from 'react-redux'
import StockmovementsEdit from '../../Pages/Stockmovements/StockmovementsEdit'
import { EditStockmovements, GetStockmovement, fillStockmovementnotification } from '../../Redux/StockmovementSlice'
import { GetStocks } from '../../Redux/StockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'

const mapStateToProps = (state) => ({
    Stocks: state.Stocks,
    Stockmovements: state.Stockmovements,
    Stockdefines: state.Stockdefines,
    Stocktypes: state.Stocktypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditStockmovements, GetStockmovement,
    fillStockmovementnotification, GetStocks,
    GetStockdefines, GetStocktypes
}

export default connect(mapStateToProps, mapDispatchToProps)(StockmovementsEdit)