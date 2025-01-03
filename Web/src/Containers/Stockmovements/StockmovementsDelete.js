import { connect } from 'react-redux'
import StockmovementsDelete from '../../Pages/Stockmovements/StockmovementsDelete'
import { DeleteStockmovements, } from '../../Redux/StockmovementSlice'

const mapStateToProps = (state) => ({
    Stockmovements: state.Stockmovements,
    Stocks: state.Stocks,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteStockmovements, 
}

export default connect(mapStateToProps, mapDispatchToProps)(StockmovementsDelete)