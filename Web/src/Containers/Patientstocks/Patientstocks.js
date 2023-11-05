import { connect } from 'react-redux'
import Patientstocks from '../../Pages/Patientstocks/Patientstocks'
import { GetPatientstocks, fillPatientstocknotification, handleApprovemodal, DeletePatientstocks, handleDeletemodal, handleSelectedPatientstock } from '../../Redux/PatientstockSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { Getpreregistrations } from '../../Redux/PatientSlice'
import { GetPatientstockmovements } from '../../Redux/PatientstockmovementSlice'


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
    GetPatientstocks, fillPatientstocknotification,
    DeletePatientstocks, handleDeletemodal, handleSelectedPatientstock,
    GetPatientdefines, GetStockdefines,
    GetDepartments, Getpreregistrations, handleApprovemodal,
    GetPatientstockmovements
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientstocks)