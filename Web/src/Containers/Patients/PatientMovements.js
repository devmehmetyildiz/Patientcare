import { connect } from 'react-redux'
import PatientMovements from '../../Pages/Patients/PatientMovements'
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetPatient, DeletePatientmovements, EditPatientmovements, fillPatientnotification } from "../../Redux/PatientSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetUsers } from '../../Redux/UserSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Cases: state.Cases,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetCases, GetPatientdefines, GetPatient, GetUsers, DeletePatientmovements, EditPatientmovements, fillPatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientMovements)