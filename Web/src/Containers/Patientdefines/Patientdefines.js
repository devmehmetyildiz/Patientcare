import { connect } from 'react-redux'
import Patientdefines from '../../Pages/Patientdefines/Patientdefines'
import {
    GetPatientdefines, removePatientdefinenotification, fillPatientdefinenotification, DeletePatientdefines,
    handleDeletemodal, handleSelectedPatientdefine
} from '../../Redux/PatientdefineSlice'
import { GetPatienttypes, removePatienttypenotification } from '../../Redux/PatienttypeSlice'
import { GetCostumertypes, removeCostumertypenotification } from '../../Redux/CostumertypeSlice'

const mapStateToProps = (state) => ({
    Patientdefines: state.Patientdefines,
    Profile: state.Profile,
    Patienttypes: state.Patienttypes,
    Costumertypes: state.Costumertypes
})

const mapDispatchToProps = {
    GetPatientdefines, removePatientdefinenotification, fillPatientdefinenotification, DeletePatientdefines,
    handleDeletemodal, handleSelectedPatientdefine, GetPatienttypes, removePatienttypenotification,
    GetCostumertypes, removeCostumertypenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientdefines)