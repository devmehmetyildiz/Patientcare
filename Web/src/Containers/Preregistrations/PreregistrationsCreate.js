import { connect } from 'react-redux'
import PreregistrationsCreate from "../../Pages/Preregistrations/PreregistrationsCreate"
import { AddPatients, fillPatientnotification } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetCostumertypes } from "../../Redux/CostumertypeSlice"
import { GetPatienttypes } from "../../Redux/PatienttypeSlice"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Costumertypes: state.Costumertypes,
  Patienttypes: state.Patienttypes,
  Departments: state.Departments,
  Cases: state.Cases,
  Profile: state.Profile
})

const mapDispatchToProps = {
  AddPatients, fillPatientnotification, GetPatientdefines,
  GetDepartments, GetCases, GetPatienttypes, GetCostumertypes
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsCreate)