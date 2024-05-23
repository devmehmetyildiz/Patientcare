import { connect } from 'react-redux'
import StocktypegroupsEdit from '../../Pages/Stocktypegroups/StocktypegroupsEdit'
import { EditStocktypegroups, GetStocktypegroup, handleSelectedStocktypegroup, fillStocktypegroupnotification } from '../../Redux/StocktypegroupSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'

const mapStateToProps = (state) => ({
    Stocktypegroups: state.Stocktypegroups,
    Stocktypes: state.Stocktypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditStocktypegroups, GetStocktypegroup, handleSelectedStocktypegroup, fillStocktypegroupnotification,GetStocktypes
}

export default connect(mapStateToProps, mapDispatchToProps)(StocktypegroupsEdit)