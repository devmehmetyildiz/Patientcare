import { connect } from 'react-redux'
import PatientsEditcase from '../../Pages/Patients/PatientsEditcase'
import { GetPatient, removePatientnotification, fillPatientnotification,Editpatientcase } from "../../Redux/PatientSlice"
import { GetPatientdefines, removePatientdefinenotification } from "../../Redux/PatientdefineSlice"
import { GetCases, removeCasenotification } from "../../Redux/CaseSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Cases: state.Cases,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatient, removePatientnotification, GetPatientdefines,Editpatientcase,
    removePatientdefinenotification, GetCases, removeCasenotification, fillPatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEditcase)