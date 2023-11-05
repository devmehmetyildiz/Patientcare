import { connect } from 'react-redux'
import PatientsEditcase from '../../Pages/Patients/PatientsEditcase'
import { GetPatient,  fillPatientnotification,Editpatientcase } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetCases } from "../../Redux/CaseSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Cases: state.Cases,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatient,  GetPatientdefines,Editpatientcase,
     GetCases,  fillPatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEditcase)