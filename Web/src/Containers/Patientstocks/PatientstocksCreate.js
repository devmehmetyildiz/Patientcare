import { connect } from 'react-redux'
import PatientstocksCreate from '../../Pages/Patientstocks/PatientstocksCreate'
import { AddPatientstocks, removePatientstocknotification, fillPatientstocknotification } from '../../Redux/Reducers/PatientstockReducer'
import { GetPatients, Getpreregistrations, removePatientnotification } from "../../Redux/Reducers/PatientReducer"
import { GetStockdefines, removeStockdefinenotification } from "../../Redux/Reducers/StockdefineReducer"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Reducers/DepartmentReducer"

const mapStateToProps = (state) => ({
    Patientstocks: state.Patientstocks,
    Patients: state.Patients,
    Departments: state.Departments,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPatientstocks, removePatientstocknotification, fillPatientstocknotification, GetPatients, Getpreregistrations, removePatientnotification,
    GetStockdefines, removeStockdefinenotification, GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientstocksCreate)