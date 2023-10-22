import { connect } from 'react-redux'
import PatientsIn from "../../Pages/Patients/PatientsIn"
import { InPatients, removePatientnotification, fillPatientnotification, handleInmodal } from "../../Redux/PatientSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = { InPatients, removePatientnotification, fillPatientnotification, handleInmodal }

export default connect(mapStateToProps, mapDispatchToProps)(PatientsIn)