import { connect } from 'react-redux'
import CasesCreate from '../../Pages/Cases/CasesCreate'
import { AddCases, removeCasenotification, fillCasenotification } from "../../Redux/Reducers/CaseReducer"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Reducers/DepartmentReducer"


const mapStateToProps = (state) => ({
  Cases: state.Cases,
  Departments: state.Departments,
  Profile: state.Profile
})

const mapDispatchToProps = { AddCases, removeCasenotification, fillCasenotification, GetDepartments, removeDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(CasesCreate)