import { connect } from 'react-redux'
import Patientmovements from '../../Pages/Patientmovements/Patientmovements'
import { GetPatientmovements, removePatientmovementnotification, DeletePatientmovements, handleDeletemodal, handleSelectedPatientmovement } from '../../Redux/PatientmovementSlice'
import { GetPatients, removePatientnotification } from '../../Redux/PatientSlice'
import { GetPatientdefines, removePatientdefinenotification } from '../../Redux/PatientdefineSlice'

const mapStateToProps = (state) => ({
    Patientmovements: state.Patientmovements,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientmovements, removePatientmovementnotification, DeletePatientmovements, handleDeletemodal, handleSelectedPatientmovement,
    GetPatientdefines, removePatientdefinenotification, GetPatients, removePatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientmovements)