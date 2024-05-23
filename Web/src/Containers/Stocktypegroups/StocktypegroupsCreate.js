import { connect } from 'react-redux'
import StocktypegroupsCreate from '../../Pages/Stocktypegroups/StocktypegroupsCreate'
import { AddStocktypegroups, fillStocktypegroupnotification } from '../../Redux/StocktypegroupSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'

const mapStateToProps = (state) => ({
    Stocktypegroups: state.Stocktypegroups,
    Stocktypes: state.Stocktypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddStocktypegroups, fillStocktypegroupnotification, GetStocktypes
}

export default connect(mapStateToProps, mapDispatchToProps)(StocktypegroupsCreate)