import { connect } from 'react-redux'
import PreregistrationsEditstock from '../../Pages/Preregistrations/PreregistrationsEditstock'
import { GetPatient, EditPatientstocks, removePatientnotification, fillPatientnotification } from "../../Redux/PatientSlice"
import { GetStockdefines, AddStockdefines, removeStockdefinenotification, fillStockdefinenotification } from "../../Redux/StockdefineSlice"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Patients: state.Patients,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatient, EditPatientstocks, removePatientnotification, fillPatientnotification,
    GetStockdefines, AddStockdefines, removeStockdefinenotification, fillStockdefinenotification,
    GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsEditstock)