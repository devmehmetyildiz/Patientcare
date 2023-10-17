import { connect } from 'react-redux'
import PreregistrationsEditstock from '../../Pages/Preregistrations/PreregistrationsEditstock'
import { GetPatient, EditPatientstocks, removePatientnotification, fillPatientnotification } from "../../Redux/PatientSlice"
import { GetStockdefines, AddStockdefines, removeStockdefinenotification, fillStockdefinenotification } from "../../Redux/StockdefineSlice"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/DepartmentSlice"
import { GetFiles, removeFilenotification } from "../../Redux/FileSlice"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/PatientdefineSlice"
import { GetPatientstocks, removePatientstocknotification } from "../../Redux/PatientstockSlice"
import { GetPatientstockmovements, removePatientstockmovementnotification } from "../../Redux/PatientstockmovementSlice"

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Patients: state.Patients,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile,
    Files: state.Files,
    Patientdefines: state.Patientdefines,
    Patientstocks: state.Patientstocks,
    Patientstockmovements: state.Patientstockmovements
})

const mapDispatchToProps = {
    GetPatient, EditPatientstocks, removePatientnotification, fillPatientnotification, GetPatientstocks, removePatientstocknotification,
    GetStockdefines, AddStockdefines, removeStockdefinenotification, fillStockdefinenotification, GetPatientstockmovements, removePatientstockmovementnotification,
    GetDepartments, removeDepartmentnotification, GetFiles, removeFilenotification, GetPatientdefines, removePatientdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsEditstock)