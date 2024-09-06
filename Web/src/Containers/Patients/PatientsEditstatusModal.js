import { connect } from 'react-redux'
import PatientsEditstatusModal from '../../Pages/Patients/PatientsEditstatusModal'
import { EditPatientdates, fillPatientnotification, GetPatient, GetPatients } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditPatientdates, fillPatientnotification, GetPatient, GetPatients, GetPatientdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEditstatusModal)