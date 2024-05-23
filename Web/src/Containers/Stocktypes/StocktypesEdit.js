import { connect } from 'react-redux'
import StocktypesEdit from '../../Pages/Stocktypes/StocktypesEdit'
import { EditStocktypes, GetStocktype, handleSelectedStocktype, fillStocktypenotification } from '../../Redux/StocktypeSlice'


const mapStateToProps = (state) => ({
    Stocktypes: state.Stocktypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditStocktypes, GetStocktype, handleSelectedStocktype, fillStocktypenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(StocktypesEdit)