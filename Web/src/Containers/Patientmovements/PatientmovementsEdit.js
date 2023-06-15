import { connect } from 'react-redux'
import PatientmovementsEdit from '../../Pages/Patientmovements/PatientmovementEdit'
import { GetPatientmovement, removePatientmovementnotification, fillPatientmovementnotification, EditPatientmovements } from '../../Redux/Reducers/PatientmovementReducer'
import { GetPatients, removePatientnotification } from '../../Redux/Reducers/PatientReducer'

const mapStateToProps = (state) => ({
    Patientmovements: state.Patientmovements,
    Patients: state.Patients,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientmovement, removePatientmovementnotification, fillPatientmovementnotification, EditPatientmovements,
    GetPatients, removePatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientmovementsEdit)