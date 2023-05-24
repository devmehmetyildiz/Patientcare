import { connect } from 'react-redux'
import PreregistrationsEditstock from '../../Pages/Preregistrations/PreregistrationsEditstock'
import { GetPatient, EditPatientstocks, removePatientnotification, fillPatientnotification } from "../../Redux/Actions/PatientAction"
import { GetStockdefines, AddStockdefines, removeStockdefinenotification, fillStockdefinenotification } from "../../Redux/Actions/StockdefineAction"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Actions/DepartmentAction"

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Patients: state.Patients,
    Stockdefines: state.Stockdefines,
})

const mapDispatchToProps = {
    GetPatient, EditPatientstocks, removePatientnotification, fillPatientnotification,
    GetStockdefines, AddStockdefines, removeStockdefinenotification, fillStockdefinenotification,
    GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsEditstock)