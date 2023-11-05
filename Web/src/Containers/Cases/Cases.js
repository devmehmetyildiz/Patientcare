import { connect } from 'react-redux'
import Cases from "../../Pages/Cases/Cases"
import { GetCases, DeleteCases, fillCasenotification, handleDeletemodal, handleSelectedCase } from "../../Redux/CaseSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
  Cases: state.Cases,
  Profile: state.Profile,
  Departments: state.Departments
})

const mapDispatchToProps = {
  GetCases, DeleteCases,
  fillCasenotification, handleDeletemodal, handleSelectedCase,
  GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(Cases)