import { connect } from 'react-redux'
import PreregistrationsPrepareStepOne from "../../Pages/Preregistrations/PreregistrationsPrepareStepOne"
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetCostumertypes } from '../../Redux/CostumertypeSlice'
import { GetPatienttypes } from '../../Redux/PatienttypeSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { GetCases } from '../../Redux/CaseSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patienttypes: state.Patienttypes,
    Costumertypes: state.Costumertypes,
    Departments: state.Departments,
    Cases: state.Cases,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientdefines,
    GetCostumertypes,
    GetPatienttypes,
    GetDepartments,
    GetCases
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsPrepareStepOne)