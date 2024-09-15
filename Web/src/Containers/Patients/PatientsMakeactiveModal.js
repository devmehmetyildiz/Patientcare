import { connect } from 'react-redux'
import PatientsMakeactiveModal from '../../Pages/Patients/PatientsMakeactiveModal'
import { MakeactivePatients, fillPatientnotification } from '../../Redux/PatientSlice'
import { GetCases } from '../../Redux/CaseSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Cases: state.Cases,
    Departments: state.Departments,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    MakeactivePatients, fillPatientnotification, GetCases, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsMakeactiveModal)