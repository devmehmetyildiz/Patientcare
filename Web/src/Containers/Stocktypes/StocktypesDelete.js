import { connect } from 'react-redux'
import StocktypesDelete from '../../Pages/Stocktypes/StocktypesDelete'
import { DeleteStocktypes, handleDeletemodal, handleSelectedStocktype } from '../../Redux/StocktypeSlice'


const mapStateToProps = (state) => ({
    Stocktypes: state.Stocktypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteStocktypes, handleDeletemodal, handleSelectedStocktype
}

export default connect(mapStateToProps, mapDispatchToProps)(StocktypesDelete)