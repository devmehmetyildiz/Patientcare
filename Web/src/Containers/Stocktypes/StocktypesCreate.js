import { connect } from 'react-redux'
import StocktypesCreate from '../../Pages/Stocktypes/StocktypesCreate'
import { AddStocktypes, fillStocktypenotification } from '../../Redux/StocktypeSlice'


const mapStateToProps = (state) => ({
    Stocktypes: state.Stocktypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddStocktypes, fillStocktypenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(StocktypesCreate)