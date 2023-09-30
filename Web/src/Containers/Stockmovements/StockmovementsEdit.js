import { connect } from 'react-redux'
import StockmovementsEdit from '../../Pages/Stockmovements/StockmovementsEdit'
import { EditStockmovements, GetStockmovement, handleSelectedStockmovement, removeStockmovementnotification, fillStockmovementnotification } from '../../Redux/StockmovementSlice'
import { GetStocks, removeStocknotification } from '../../Redux/StockSlice'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/StockdefineSlice'


const mapStateToProps = (state) => ({
    Stocks: state.Stocks,
    Stockmovements: state.Stockmovements,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditStockmovements, GetStockmovement, handleSelectedStockmovement,
    removeStockmovementnotification, fillStockmovementnotification, GetStocks, removeStocknotification,
    GetStockdefines, removeStockdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(StockmovementsEdit)