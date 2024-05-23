import { connect } from 'react-redux'
import StockdefinesCreate from '../../Pages/Stockdefines/StockdefinesCreate'
import { AddStockdefines, fillStockdefinenotification } from '../../Redux/StockdefineSlice'
import { GetUnits } from '../../Redux/UnitSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'

const mapStateToProps = (state) => ({
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Stocktypes: state.Stocktypes,
    Profile: state.Profile
})

const mapDispatchToProps = { AddStockdefines, fillStockdefinenotification, GetUnits, GetStocktypes }

export default connect(mapStateToProps, mapDispatchToProps)(StockdefinesCreate)