import { connect } from 'react-redux'
import PatientsuppliesCreate from '../../Pages/Patientsupplies/PatientsuppliesCreate'
import { AddPatientstocks,  fillPatientstocknotification } from '../../Redux/PatientstockSlice'
import { GetPatients, Getpreregistrations, removePatientnotification } from "../../Redux/PatientSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"

const mapStateToProps = (state) => ({
    Patientstocks: state.Patientstocks,
    Patientdefines: state.Patientdefines,
    Patients: state.Patients,
    Departments: state.Departments,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPatientstocks,  fillPatientstocknotification, GetPatients, Getpreregistrations, removePatientnotification,
    GetStockdefines, GetDepartments,  GetPatientdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsuppliesCreate)