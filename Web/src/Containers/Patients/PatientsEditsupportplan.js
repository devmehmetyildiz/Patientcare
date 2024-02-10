import { connect } from 'react-redux'
import PatientsEditsupportplan from '../../Pages/Patients/PatientsEditsupportplan'
import { GetPatient, fillPatientnotification, UpdatePatientsupportplans } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetSupportplans } from "../../Redux/SupportplanSlice"
import { GetSupportplanlists, AddSupportplanlists } from "../../Redux/SupportplanlistSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Departments: state.Departments,
    Supportplans: state.Supportplans,
    Supportplanlists: state.Supportplanlists,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatient, fillPatientnotification, UpdatePatientsupportplans,
    GetSupportplanlists, AddSupportplanlists, GetPatientdefines, GetSupportplans, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEditsupportplan)