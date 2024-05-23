import { connect } from 'react-redux'
import StockdefinesEdit from '../../Pages/Stockdefines/StockdefinesEdit'
import { EditStockdefines, GetStockdefine, handleSelectedStockdefine, fillStockdefinenotification } from '../../Redux/StockdefineSlice'
import { GetUnits } from '../../Redux/UnitSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'

const mapStateToProps = (state) => ({
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Stocktypes: state.Stocktypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditStockdefines, GetStockdefine, handleSelectedStockdefine, fillStockdefinenotification, GetUnits, GetStocktypes
}

export default connect(mapStateToProps, mapDispatchToProps)(StockdefinesEdit)