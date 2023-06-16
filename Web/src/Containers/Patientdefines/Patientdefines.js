import { connect } from 'react-redux'
import Patientdefines from '../../Pages/Patientdefines/Patientdefines'
import {
    GetPatientdefines, removePatientdefinenotification, fillPatientdefinenotification, DeletePatientdefines,
    handleDeletemodal, handleSelectedPatientdefine
} from '../../Redux/PatientdefineSlice'

const mapStateToProps = (state) => ({
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientdefines, removePatientdefinenotification, fillPatientdefinenotification, DeletePatientdefines,
    handleDeletemodal, handleSelectedPatientdefine
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientdefines)