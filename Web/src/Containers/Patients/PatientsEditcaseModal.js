import { connect } from 'react-redux'
import PatientsEditcaseModal from '../../Pages/Patients/PatientsEditcaseModal'
import { fillPatientnotification, Editpatientcase, GetPatient, GetPatients } from "../../Redux/PatientSlice"
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
    fillPatientnotification, Editpatientcase, GetPatient,
    GetPatients, GetPatientdefines, GetCases, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEditcaseModal)