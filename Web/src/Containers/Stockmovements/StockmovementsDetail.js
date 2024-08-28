import { connect } from 'react-redux'
import StockmovementsDetail from '../../Pages/Stockmovements/StockmovementsDetail'
import { GetStockmovement } from '../../Redux/StockmovementSlice'
import { GetStocks } from '../../Redux/StockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'


const mapStateToProps = (state) => ({
    Stocks: state.Stocks,
    Stockmovements: state.Stockmovements,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetStockmovement, GetStocks, GetStockdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(StockmovementsDetail)