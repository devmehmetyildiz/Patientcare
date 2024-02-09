import { connect } from 'react-redux'
import PreregistrationsEditfile from '../../Pages/Preregistrations/PreregistrationsEditfile'
import { GetFiles, EditFiles, fillFilenotification, DeleteFiles } from "../../Redux/FileSlice"
import { GetPatient } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"

const mapStateToProps = (state) => ({
    Files: state.Files,
    Patients: state.Patients,
    Profile: state.Profile,
    Patientdefines: state.Patientdefines,
    Usagetypes: state.Usagetypes
})

const mapDispatchToProps = {
    EditFiles, fillFilenotification, DeleteFiles,
    GetPatient, GetFiles, GetPatientdefines, GetUsagetypes
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsEditfile)