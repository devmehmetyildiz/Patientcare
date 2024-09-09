import { connect } from 'react-redux'
import PatientsInsertstockModal from '../../Pages/Patients/PatientsInsertstockModal'
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetPatients, GetPatient, fillPatientnotification } from "../../Redux/PatientSlice"
import { GetStocks, CreateStockFromStock } from '../../Redux/StockSlice'
import { GetStockmovements } from '../../Redux/StockmovementSlice'
import { GetStocktypes } from '../../Redux/StocktypeSlice'
import { GetStocktypegroups } from '../../Redux/StocktypegroupSlice'
import { GetWarehouses } from '../../Redux/WarehouseSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetUnits } from '../../Redux/UnitSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Stocks: state.Stocks,
    Stockmovements: state.Stockmovements,
    Stocktypes: state.Stocktypes,
    Stocktypegroups: state.Stocktypegroups,
    Warehouses: state.Warehouses,
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientdefines, GetPatients, GetPatient, GetStocks, GetStockdefines, GetUnits, CreateStockFromStock,
    GetStockmovements, GetStocktypes, GetStocktypegroups, GetWarehouses, fillPatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsInsertstockModal)