import { connect } from 'react-redux'
import PreregistrationsEditfile from '../../Pages/Preregistrations/PreregistrationsEditfile'
import { EditFiles, fillFilenotification, removeFilenotification, DeleteFiles } from "../../Redux/Reducers/FileReducer"
import { GetPatient, removePatientnotification } from "../../Redux/Reducers/PatientReducer"

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