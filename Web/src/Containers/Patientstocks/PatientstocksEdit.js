import { connect } from 'react-redux'
import PatientstocksEdit from '../../Pages/Patientstocks/PatientstocksEdit'
import { EditPatientstocks, GetPatientstock, RemoveSelectedPatientstock, removePatientstocknotification, fillPatientstocknotification } from '../../Redux/PatientstockSlice'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/StockdefineSlice'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/DepartmentSlice'
import { GetPatients, Getpreregistrations, removePatientnotification } from "../../Redux/PatientSlice"

const mapStateToProps = (state) => ({
    Patientstocks: state.Patientstocks,
    Patients: state.Patients,
    Stockdefines: state.Stockdefines,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditPatientstocks, GetPatientstock, RemoveSelectedPatientstock, removePatientstocknotification, fillPatientstocknotification,
    GetStockdefines, removeStockdefinenotification, GetDepartments, removeDepartmentnotification, GetPatients, Getpreregistrations, removePatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientstocksEdit)