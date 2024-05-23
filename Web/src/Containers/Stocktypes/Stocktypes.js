import { connect } from 'react-redux'
import Stocktypes from '../../Pages/Stocktypes/Stocktypes'
import { GetStocktypes, handleDeletemodal, handleSelectedStocktype } from '../../Redux/StocktypeSlice'


const mapStateToProps = (state) => ({
    Stocktypes: state.Stocktypes,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetStocktypes, handleDeletemodal, handleSelectedStocktype
}

export default connect(mapStateToProps, mapDispatchToProps)(Stocktypes)