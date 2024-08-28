import { connect } from 'react-redux'
import PreregistrationsPrepareStepTwo from "../../Pages/Preregistrations/PreregistrationsPrepareStepTwo"
import { GetStocktypes } from '../../Redux/StocktypeSlice'
import { GetStocktypegroups } from '../../Redux/StocktypegroupSlice'
import { GetUnits } from '../../Redux/UnitSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetStockmovements } from '../../Redux/StockmovementSlice'
import { GetStocks } from '../../Redux/StockSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Stocktypes: state.Stocktypes,
    Stocktypegroups: state.Stocktypegroups,
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Stockmovements: state.Stockmovements,
    Stocks: state.Stocks,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetStockdefines, GetStocktypes, GetStocktypegroups, GetUnits, GetStockmovements, GetStocks
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsPrepareStepTwo)