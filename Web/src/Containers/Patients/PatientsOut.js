import { connect } from 'react-redux'
import PatientsOut from "../../Pages/Patients/PatientsOut"
import { OutPatients,  fillPatientnotification, handleOutmodal } from "../../Redux/PatientSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = { OutPatients,  fillPatientnotification, handleOutmodal }

export default connect(mapStateToProps, mapDispatchToProps)(PatientsOut)