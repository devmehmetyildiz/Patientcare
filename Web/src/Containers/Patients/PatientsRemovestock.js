import { connect } from 'react-redux'
import PatientsRemovestock from '../../Pages/Patients/PatientsRemovestock'
import { GetPatient, removePatientnotification } from "../../Redux/PatientSlice"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/PatientdefineSlice"
import { GetPatientstocks, removePatientstocknotification } from "../../Redux/PatientstockSlice"
import { GetPatientstockmovements, removePatientstockmovementnotification } from "../../Redux/PatientstockmovementSlice"
import { GetWarehouses, removeWarehousenotification } from "../../Redux/WarehouseSlice"
import { TransferfromPatient, GetStocks, fillStocknotification, removeStocknotification } from "../../Redux/StockSlice"
import { GetStockmovements, removeStockmovementnotification } from "../../Redux/StockmovementSlice"
import { GetStockdefines, removeStockdefinenotification } from "../../Redux/StockdefineSlice"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patientstocks: state.Patientstocks,
    Patientstockmovements: state.Patientstockmovements,
    Warehouses: state.Warehouses,
    Stocks: state.Stocks,
    Stockmovements: state.Stockmovements,
    Stockdefines: state.Stockdefines,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    TransferfromPatient, GetPatient, fillStocknotification, removePatientnotification, GetPatientdefines, removePatientdefinenotification, GetPatientstocks, removePatientstocknotification,
    GetPatientstockmovements, removePatientstockmovementnotification, GetWarehouses, removeWarehousenotification, GetDepartments, removeDepartmentnotification,
    GetStocks, removeStocknotification, GetStockmovements, removeStockmovementnotification, GetStockdefines, removeStockdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsRemovestock)