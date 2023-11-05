import { connect } from 'react-redux'
import PatientmedicinesCreate from '../../Pages/Patientmedicines/PatientmedicinesCreate'
import { AddPatientstocks,  fillPatientstocknotification } from '../../Redux/PatientstockSlice'
import { GetPatients, Getpreregistrations } from "../../Redux/PatientSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Patientstocks: state.Patientstocks,
    Patients: state.Patients,
    Departments: state.Departments,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPatientstocks,  fillPatientstocknotification, GetPatients, Getpreregistrations,
    GetStockdefines,  GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientmedicinesCreate)