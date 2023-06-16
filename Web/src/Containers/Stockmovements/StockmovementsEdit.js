import { connect } from 'react-redux'
import StockmovementsEdit from '../../Pages/Stockmovements/StockmovementsEdit'
import { EditStockmovements, GetStockmovement, handleSelectedStockmovement, removeStockmovementnotification, fillStockmovementnotification } from '../../Redux/StockmovementSlice'
import { GetStocks, removeStocknotification } from '../../Redux/StockSlice'


const mapStateToProps = (state) => ({
    Stocks: state.Stocks,
    Stockmovements: state.Stockmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditStockmovements, GetStockmovement, handleSelectedStockmovement,
    removeStockmovementnotification, fillStockmovementnotification,GetStocks, removeStocknotification 
}

export default connect(mapStateToProps, mapDispatchToProps)(StockmovementsEdit)