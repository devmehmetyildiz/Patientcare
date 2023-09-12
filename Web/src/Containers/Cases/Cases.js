import { connect } from 'react-redux'
import Cases from "../../Pages/Cases/Cases"
import { GetCases, DeleteCases, removeCasenotification, fillCasenotification, handleDeletemodal, handleSelectedCase } from "../../Redux/CaseSlice"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
  Cases: state.Cases,
  Profile: state.Profile,
  Departments: state.Departments
})

const mapDispatchToProps = {
  GetCases, DeleteCases, removeCasenotification,
  fillCasenotification, handleDeletemodal, handleSelectedCase,
  GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Cases)