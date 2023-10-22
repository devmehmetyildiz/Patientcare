import { connect } from 'react-redux'
import PatientstocksEdit from '../../Pages/Patientstocks/PatientstocksEdit'
import { EditPatientstocks, GetPatientstock, handleSelectedPatientstock, removePatientstocknotification, fillPatientstocknotification } from '../../Redux/PatientstockSlice'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/StockdefineSlice'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/DepartmentSlice'
import { GetPatients, removePatientnotification } from "../../Redux/PatientSlice"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/PatientdefineSlice"

const mapStateToProps = (state) => ({
    Patientstocks: state.Patientstocks,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patients: state.Patients,
    Stockdefines: state.Stockdefines,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditPatientstocks, GetPatientstock, handleSelectedPatientstock, removePatientstocknotification, fillPatientstocknotification, GetPatientdefines, removePatientdefinenotification,
    GetStockdefines, removeStockdefinenotification, GetDepartments, removeDepartmentnotification, GetPatients, removePatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientstocksEdit)