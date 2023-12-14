import { connect } from 'react-redux'
import PatientmedicinesEdit from '../../Pages/Patientmedicines/PatientmedicinesEdit'
import { EditPatientstocks, GetPatientstock, handleSelectedPatientstock, fillPatientstocknotification } from '../../Redux/PatientstockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { GetPatients } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"

const mapStateToProps = (state) => ({
    Patientstocks: state.Patientstocks,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Stockdefines: state.Stockdefines,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditPatientstocks, GetPatientstock, handleSelectedPatientstock, fillPatientstocknotification, GetPatientdefines,
    GetStockdefines, GetDepartments, GetPatients
}
export default connect(mapStateToProps, mapDispatchToProps)(PatientmedicinesEdit)