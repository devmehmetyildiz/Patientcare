import { connect } from 'react-redux'
import StocktypegroupsDelete from '../../Pages/Stocktypegroups/StocktypegroupsDelete'
import { DeleteStocktypegroups, handleDeletemodal, handleSelectedStocktypegroup } from '../../Redux/StocktypegroupSlice'


const mapStateToProps = (state) => ({
    Stocktypegroups: state.Stocktypegroups,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteStocktypegroups, handleDeletemodal, handleSelectedStocktypegroup
}

export default connect(mapStateToProps, mapDispatchToProps)(StocktypegroupsDelete)