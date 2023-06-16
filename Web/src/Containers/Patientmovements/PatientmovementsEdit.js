import { connect } from 'react-redux'
import PatientmovementsEdit from '../../Pages/Patientmovements/PatientmovementEdit'
import { GetPatientmovement, handleSelectedPatientmovement, fillPatientmovementnotification, EditPatientmovements } from '../../Redux/PatientmovementSlice'
import { GetPatients, removePatientnotification } from '../../Redux/PatientSlice'

const mapStateToProps = (state) => ({
    Patientmovements: state.Patientmovements,
    Patients: state.Patients,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientmovement, handleSelectedPatientmovement, fillPatientmovementnotification, EditPatientmovements,
    GetPatients, removePatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientmovementsEdit)