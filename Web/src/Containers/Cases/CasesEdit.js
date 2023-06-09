import { connect } from 'react-redux'
import CasesEdit from '../../Pages/Cases/CasesEdit'
import { EditCases, GetCase, RemoveSelectedCase, removeCasenotification, fillCasenotification } from "../../Redux/Actions/CaseAction"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Actions/DepartmentAction"

const mapStateToProps = (state) => ({
  Cases: state.Cases,
  Departments: state.Departments,
  Profile: state.Profile
})

const mapDispatchToProps = {
  EditCases, GetCase, RemoveSelectedCase, removeCasenotification, fillCasenotification, GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(CasesEdit)