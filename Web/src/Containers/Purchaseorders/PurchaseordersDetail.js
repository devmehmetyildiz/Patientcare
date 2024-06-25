import { connect } from 'react-redux'
import PurchaseordersDetail from "../../Pages/Purchaseorders/PurchaseordersDetail"
import { handleDetailmodal, handleSelectedPurchaseorder, fillPurchaseordernotification } from "../../Redux/PurchaseorderSlice"
import { GetUsers } from "../../Redux/UserSlice"
import { GetStocks } from "../../Redux/StockSlice"
import { GetFiles } from "../../Redux/FileSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"
import { GetUnits } from "../../Redux/UnitSlice"
import { GetWarehouses } from "../../Redux/WarehouseSlice"
import { GetPatients } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Users: state.Users,
    Files: state.Files,
    Stocks: state.Stocks,
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Usagetypes: state.Usagetypes,
    Warehouses: state.Warehouses,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Cases: state.Cases,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    handleDetailmodal, handleSelectedPurchaseorder,
    GetUsers, GetStocks, GetFiles, GetUsagetypes, GetStockdefines, GetUnits,
    GetWarehouses, GetPatientdefines, GetPatients, GetCases,
    GetDepartments, fillPurchaseordernotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersDetail)