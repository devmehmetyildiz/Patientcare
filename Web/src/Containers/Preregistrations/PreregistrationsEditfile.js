import { connect } from 'react-redux'
import PreregistrationsEditfile from '../../Pages/Preregistrations/PreregistrationsEditfile'
import { EditFiles, fillFilenotification, removeFilenotification, DeleteFiles } from "../../Redux/FileSlice"
import { GetPatient, removePatientnotification } from "../../Redux/PatientSlice"

const mapStateToProps = (state) => ({
    Files: state.Files,
    Patients: state.Patients,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditFiles, fillFilenotification, removeFilenotification, DeleteFiles,
    GetPatient, removePatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsEditfile)