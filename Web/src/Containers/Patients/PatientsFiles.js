import { connect } from 'react-redux'
import PatientsFiles from '../../Pages/Patients/PatientsFiles'
import { GetFiles, EditFiles, fillFilenotification, DeleteFiles } from "../../Redux/FileSlice"
import { GetPatient } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"

const mapStateToProps = (state) => ({
    Files: state.Files,
    Patients: state.Patients,
    Profile: state.Profile,
    Patientdefines: state.Patientdefines
})

const mapDispatchToProps = {
    EditFiles, fillFilenotification, DeleteFiles,
    GetPatient, GetFiles, GetPatientdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsFiles)