import { connect } from 'react-redux'
import CasesDelete from "../../Pages/Cases/CasesDelete"
import { DeleteCases, removeCasenotification, fillCasenotification, handleDeletemodal, handleSelectedCase } from "../../Redux/CaseSlice"

const mapStateToProps = (state) => ({
    Cases: state.Cases,
    Profile: state.Profile
})

const mapDispatchToProps = { DeleteCases, removeCasenotification, fillCasenotification, handleDeletemodal, handleSelectedCase }

export default connect(mapStateToProps, mapDispatchToProps)(CasesDelete)