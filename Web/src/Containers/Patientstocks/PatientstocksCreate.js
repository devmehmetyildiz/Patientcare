import { connect } from 'react-redux'
import PatientstocksCreate from '../../Pages/Patientstocks/PatientstocksCreate'
import { AddPatientstocks, fillPatientstocknotification } from '../../Redux/PatientstockSlice'
import { GetPatients, Getpreregistrations } from "../../Redux/PatientSlice"
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
    AddPatientstocks, fillPatientstocknotification, GetPatients, Getpreregistrations,
    GetStockdefines, GetDepartments, GetPatientdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientstocksCreate)