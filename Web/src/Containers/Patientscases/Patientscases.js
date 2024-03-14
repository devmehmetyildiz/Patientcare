import { connect } from 'react-redux'
import Patientscases from '../../Pages/Patientscases/Patientscases'
import { GetPatients, Editpatientscase, fillPatientnotification } from '../../Redux/PatientSlice'
import { GetCases } from '../../Redux/CaseSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { GetPatienttypes } from '../../Redux/PatienttypeSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patienttypes: state.Patienttypes,
    Departments: state.Departments,
    Cases: state.Cases,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetPatients, Editpatientscase, fillPatientnotification, GetCases, GetPatientdefines, GetDepartments, GetPatienttypes
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientscases)