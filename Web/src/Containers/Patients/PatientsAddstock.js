import { connect } from 'react-redux'
import PatientsAddstock from '../../Pages/Patients/PatientsAddstock'
import { GetPatient } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetWarehouses, } from "../../Redux/WarehouseSlice"
import { TransfertoPatient, GetStocks, fillStocknotification } from "../../Redux/StockSlice"
import { GetStockmovements } from "../../Redux/StockmovementSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Warehouses: state.Warehouses,
    Stocks: state.Stocks,
    Stockmovements: state.Stockmovements,
    Stockdefines: state.Stockdefines,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    TransfertoPatient, GetPatient, fillStocknotification, GetPatientdefines,
    GetWarehouses, GetDepartments, GetStocks, GetStockmovements, GetStockdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsAddstock)