import { connect } from 'react-redux'
import Patientdefines from '../../Pages/Patientdefines/Patientdefines'
import {
    GetPatientdefines,  fillPatientdefinenotification, DeletePatientdefines,
    handleDeletemodal, handleSelectedPatientdefine
} from '../../Redux/PatientdefineSlice'
import { GetPatienttypes } from '../../Redux/PatienttypeSlice'
import { GetCostumertypes } from '../../Redux/CostumertypeSlice'

const mapStateToProps = (state) => ({
    Patientdefines: state.Patientdefines,
    Profile: state.Profile,
    Patienttypes: state.Patienttypes,
    Costumertypes: state.Costumertypes
})

const mapDispatchToProps = {
    GetPatientdefines, fillPatientdefinenotification, DeletePatientdefines,
    handleDeletemodal, handleSelectedPatientdefine, GetPatienttypes,
    GetCostumertypes
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientdefines)