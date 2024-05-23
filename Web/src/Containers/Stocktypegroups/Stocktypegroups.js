import { connect } from 'react-redux'
import Stocktypegroups from '../../Pages/Stocktypegroups/Stocktypegroups'
import { GetStocktypegroups, handleDeletemodal, handleSelectedStocktypegroup } from '../../Redux/StocktypegroupSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'

const mapStateToProps = (state) => ({
    Stocktypegroups: state.Stocktypegroups,
    Stocktypes: state.Stocktypes,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetStocktypegroups, handleDeletemodal, handleSelectedStocktypegroup, GetStocktypes
}

export default connect(mapStateToProps, mapDispatchToProps)(Stocktypegroups)