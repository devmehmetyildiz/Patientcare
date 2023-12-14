import { connect } from 'react-redux'
import PatientmedicinesCreate from '../../Pages/Patientmedicines/PatientmedicinesCreate'

import { AddPatientstocks, fillPatientstocknotification } from '../../Redux/PatientstockSlice'
import { GetPatients, Getpreregistrations } from "../../Redux/PatientSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"


const mapStateToProps = (state) => ({
    Patientstocks: state.Patientstocks,
    Patients: state.Patients,
    Departments: state.Departments,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile,
    Patientdefines: state.Patientdefines
})

const mapDispatchToProps = {
    AddPatientstocks,  fillPatientstocknotification, GetPatients, Getpreregistrations, 
    GetStockdefines,  GetDepartments,  GetPatientdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientmedicinesCreate)