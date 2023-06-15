import { connect } from 'react-redux'
import PatientmovementsCreate from '../../Pages/Patientmovements/PatientmovementCreate'
import { AddPatientmovements, fillPatientmovementnotification, removePatientmovementnotification } from "../../Redux/Reducers/PatientmovementReducer"
import { GetPatients, removePatientnotification } from "../../Redux/Reducers/PatientReducer"

const mapStateToProps = (state) => ({
    Patientmovements: state.Patientmovements,
    Patients: state.Patients,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPatientmovements, fillPatientmovementnotification, removePatientmovementnotification,
    GetPatients, removePatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientmovementsCreate)