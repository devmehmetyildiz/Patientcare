import { connect } from 'react-redux'
import StockmovementsEdit from '../../Pages/Stockmovements/StockmovementsEdit'
import { EditStockmovements, GetStockmovement, handleSelectedStockmovement, fillStockmovementnotification } from '../../Redux/StockmovementSlice'
import { GetStocks } from '../../Redux/StockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'


const mapStateToProps = (state) => ({
    Stocks: state.Stocks,
    Stockmovements: state.Stockmovements,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditStockmovements, GetStockmovement, handleSelectedStockmovement,
    fillStockmovementnotification, GetStocks,
    GetStockdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(StockmovementsEdit)