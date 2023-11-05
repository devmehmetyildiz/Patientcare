import { connect } from 'react-redux'
import PreregistrationsEditstock from '../../Pages/Preregistrations/PreregistrationsEditstock'
import { GetPatient, EditPatientstocks, fillPatientnotification } from "../../Redux/PatientSlice"
import { GetStockdefines, AddStockdefines, fillStockdefinenotification } from "../../Redux/StockdefineSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetFiles } from "../../Redux/FileSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetPatientstocks } from "../../Redux/PatientstockSlice"
import { GetPatientstockmovements } from "../../Redux/PatientstockmovementSlice"

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
    GetPatient, EditPatientstocks, fillPatientnotification, GetPatientstocks,
    GetStockdefines, AddStockdefines, fillStockdefinenotification, GetPatientstockmovements,
    GetDepartments, GetFiles,  GetPatientdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsEditstock)