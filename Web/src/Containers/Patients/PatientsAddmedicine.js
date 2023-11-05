import { connect } from 'react-redux'
import PatientsAddmedicine from '../../Pages/Patients/PatientsAddmedicine'
import { GetPatient } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetPatientstocks } from "../../Redux/PatientstockSlice"
import { GetPatientstockmovements } from "../../Redux/PatientstockmovementSlice"
import { GetWarehouses } from "../../Redux/WarehouseSlice"
import { TransfertoPatient, GetStocks, fillStocknotification } from "../../Redux/StockSlice"
import { GetStockmovements } from "../../Redux/StockmovementSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patientstocks: state.Patientstocks,
    Patientstockmovements: state.Patientstockmovements,
    Warehouses: state.Warehouses,
    Stocks: state.Stocks,
    Stockmovements: state.Stockmovements,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    TransfertoPatient, GetPatient, fillStocknotification,  GetPatientdefines,  GetPatientstocks,
    GetPatientstockmovements,  GetWarehouses,
    GetStocks,  GetStockmovements,  GetStockdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsAddmedicine)