import { connect } from 'react-redux'
import Cases from "../../Pages/Cases/Cases"
import { GetCases, DeleteCases, removeCasenotification, fillCasenotification } from "../../Redux/Reducers/CaseReducer"

const mapStateToProps = (state) => ({
  Cases: state.Cases,
  Profile: state.Profile
})

const mapDispatchToProps = { GetCases, DeleteCases, removeCasenotification, fillCasenotification }

export default connect(mapStateToProps, mapDispatchToProps)(Cases)