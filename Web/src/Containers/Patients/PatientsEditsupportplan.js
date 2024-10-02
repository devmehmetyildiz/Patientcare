import { connect } from 'react-redux'
import PatientsEditsupportplan from '../../Pages/Patients/PatientsEditsupportplan'
import { GetPatient, fillPatientnotification, UpdatePatientsupportplans } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetSupportplans } from "../../Redux/SupportplanSlice"
import { GetSupportplanlists, AddSupportplanlists } from "../../Redux/SupportplanlistSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Supportplans: state.Supportplans,
    Supportplanlists: state.Supportplanlists,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatient, fillPatientnotification, UpdatePatientsupportplans,
    GetSupportplanlists, AddSupportplanlists, GetPatientdefines, GetSupportplans
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEditsupportplan)