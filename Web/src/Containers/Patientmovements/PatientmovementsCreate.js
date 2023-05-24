import { connect } from 'react-redux'
import PatientmovementsCreate from '../../Pages/Patientmovements/PatientmovementCreate'
import { AddPatientmovements, fillPatientmovementnotification, removePatientmovementnotification } from "../../Redux/Actions/PatientmovementAction"
import { GetPatients, removePatientnotification } from "../../Redux/Actions/PatientAction"

const mapStateToProps = (state) => ({
    Patientmovements: state.Patientmovements,
    Patients: state.Patients
})

const mapDispatchToProps = {
    AddPatientmovements, fillPatientmovementnotification, removePatientmovementnotification,
    GetPatients, removePatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientmovementsCreate)