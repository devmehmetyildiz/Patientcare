import { connect } from 'react-redux'
import CasesCreate from '../../Pages/Cases/CasesCreate'
import { AddCases,  fillCasenotification } from "../../Redux/CaseSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"


const mapStateToProps = (state) => ({
  Cases: state.Cases,
  Departments: state.Departments,
  Profile: state.Profile
})

const mapDispatchToProps = { AddCases,  fillCasenotification, GetDepartments }

export default connect(mapStateToProps, mapDispatchToProps)(CasesCreate)