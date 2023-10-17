import { connect } from 'react-redux'
import Patientstocks from '../../Pages/Patientstocks/Patientstocks'
import { GetPatientstocks, removePatientstocknotification, fillPatientstocknotification, handleApprovemodal, DeletePatientstocks, handleDeletemodal, handleSelectedPatientstock } from '../../Redux/PatientstockSlice'
import { GetPatientdefines, removePatientdefinenotification } from '../../Redux/PatientdefineSlice'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/StockdefineSlice'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/DepartmentSlice'
import { Getpreregistrations, removePatientnotification } from '../../Redux/PatientSlice'
import { GetPatientstockmovements, removePatientstockmovementnotification } from '../../Redux/PatientstockmovementSlice'


const mapStateToProps = (state) => ({
    Patientstocks: state.Patientstocks,
    Profile: state.Profile,
    Patientdefines: state.Patientdefines,
    Stockdefines: state.Stockdefines,
    Departments: state.Departments,
    Patients: state.Patients,
    Patientstockmovements: state.Patientstockmovements
})

const mapDispatchToProps = {
    GetPatientstocks, removePatientstocknotification, fillPatientstocknotification,
    DeletePatientstocks, handleDeletemodal, handleSelectedPatientstock,
    GetPatientdefines, removePatientdefinenotification, GetStockdefines,
    removeStockdefinenotification, GetDepartments, removeDepartmentnotification,
    Getpreregistrations, removePatientnotification, handleApprovemodal,
    GetPatientstockmovements, removePatientstockmovementnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientstocks)