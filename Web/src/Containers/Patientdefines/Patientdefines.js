import { connect } from 'react-redux'
import Patientdefines from '../../Pages/Patientdefines/Patientdefines'
import { GetPatientdefines, removePatientdefinenotification, fillPatientdefinenotification, DeletePatientdefines } from '../../Redux/Reducers/PatientdefineReducer'

const mapStateToProps = (state) => ({
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientdefines, removePatientdefinenotification, fillPatientdefinenotification, DeletePatientdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientdefines)