import { connect } from 'react-redux'
import PatientstocksEdit from '../../Pages/Patientstocks/PatientstocksEdit'
import { EditPatientstocks, GetPatientstock, RemoveSelectedPatientstock, removePatientstocknotification, fillPatientstocknotification } from '../../Redux/Actions/PatientstockAction'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/Actions/StockdefineAction'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/Actions/DepartmentAction'
import { GetPatients, Getpreregistrations, removePatientnotification } from "../../Redux/Actions/PatientAction"

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