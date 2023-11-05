import { connect } from 'react-redux'
import StockmovementsCreate from '../../Pages/Stockmovements/StockmovementsCreate'
import { GetStocks } from '../../Redux/StockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { AddStockmovements, fillStockmovementnotification } from '../../Redux/StockmovementSlice'


const mapStateToProps = (state) => ({
    Stocks: state.Stocks,
    Stockmovements: state.Stockmovements,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetStocks, AddStockmovements,
    fillStockmovementnotification,
    GetStockdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(StockmovementsCreate)