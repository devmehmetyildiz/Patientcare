import { connect } from 'react-redux'
import PatientsEditcase from '../../Pages/Patients/PatientsEditcase'
import { GetPatient, fillPatientnotification, Editpatientcase } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Cases: state.Cases,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatient, GetPatientdefines, Editpatientcase,
    GetCases, fillPatientnotification, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEditcase)