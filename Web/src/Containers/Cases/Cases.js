import { connect } from 'react-redux'
import Cases from "../../Pages/Cases/Cases"
import { GetCases, DeleteCases, fillCasenotification, } from "../../Redux/CaseSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
  Cases: state.Cases,
  Profile: state.Profile,
  Departments: state.Departments
})

const mapDispatchToProps = {
  GetCases, DeleteCases, fillCasenotification, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(Cases)