import { connect } from 'react-redux'
import StockmovementsCreate from '../../Pages/Stockmovements/StockmovementsCreate'
import { GetStocks, removeStocknotification } from '../../Redux/Actions/StockAction'
import { AddStockmovements, removeStockmovementnotification, fillStockmovementnotification } from '../../Redux/Actions/StockmovementAction'


const mapStateToProps = (state) => ({
    Stocks: state.Stocks,
    Stockmovements: state.Stockmovements
})

const mapDispatchToProps = {
    GetStocks, removeStocknotification, AddStockmovements,
    removeStockmovementnotification, fillStockmovementnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(StockmovementsCreate)