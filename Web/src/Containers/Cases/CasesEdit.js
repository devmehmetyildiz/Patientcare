import { connect } from 'react-redux'
import CasesEdit from '../../Pages/Cases/CasesEdit'
import { EditCases, GetCase, handleSelectedCase,  fillCasenotification } from "../../Redux/CaseSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
  Cases: state.Cases,
  Departments: state.Departments,
  Profile: state.Profile
})

const mapDispatchToProps = {
  EditCases, GetCase, handleSelectedCase,  fillCasenotification, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(CasesEdit)