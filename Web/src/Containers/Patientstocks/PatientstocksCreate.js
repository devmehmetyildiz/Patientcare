import { connect } from 'react-redux'
import PatientstocksCreate from '../../Pages/Patientstocks/PatientstocksCreate'
import { AddPatientstocks, removePatientstocknotification, fillPatientstocknotification } from '../../Redux/Actions/PatientstockAction'
import { GetPatients, Getpreregistrations, removePatientnotification } from "../../Redux/Actions/PatientAction"
import { GetStockdefines, removeStockdefinenotification } from "../../Redux/Actions/StockdefineAction"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Actions/DepartmentAction"

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