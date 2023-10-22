import { connect } from 'react-redux'
import PatientstocksCreate from '../../Pages/Patientstocks/PatientstocksCreate'
import { AddPatientstocks, removePatientstocknotification, fillPatientstocknotification } from '../../Redux/PatientstockSlice'
import { GetPatients, Getpreregistrations, removePatientnotification } from "../../Redux/PatientSlice"
import { GetStockdefines, removeStockdefinenotification } from "../../Redux/StockdefineSlice"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/DepartmentSlice"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/PatientdefineSlice"

const mapStateToProps = (state) => ({
    Patientstocks: state.Patientstocks,
    Patientdefines: state.Patientdefines,
    Patients: state.Patients,
    Departments: state.Departments,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPatientstocks, removePatientstocknotification, fillPatientstocknotification, GetPatients, Getpreregistrations, removePatientnotification,
    GetStockdefines, removeStockdefinenotification, GetDepartments, removeDepartmentnotification, GetPatientdefines, removePatientdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientstocksCreate)