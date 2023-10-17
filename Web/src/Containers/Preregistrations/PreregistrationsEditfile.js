import { connect } from 'react-redux'
import PreregistrationsEditfile from '../../Pages/Preregistrations/PreregistrationsEditfile'
import { GetFiles, EditFiles, fillFilenotification, removeFilenotification, DeleteFiles } from "../../Redux/FileSlice"
import { GetPatient, removePatientnotification } from "../../Redux/PatientSlice"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/PatientdefineSlice"

const mapStateToProps = (state) => ({
    Files: state.Files,
    Patients: state.Patients,
    Profile: state.Profile,
    Patientdefines: state.Patientdefines
})

const mapDispatchToProps = {
    EditFiles, fillFilenotification, removeFilenotification, DeleteFiles,
    GetPatient, removePatientnotification, GetFiles, GetPatientdefines, removePatientdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsEditfile)