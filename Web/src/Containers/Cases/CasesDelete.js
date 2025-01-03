import { connect } from 'react-redux'
import CasesDelete from "../../Pages/Cases/CasesDelete"
import { DeleteCases, fillCasenotification } from "../../Redux/CaseSlice"

const mapStateToProps = (state) => ({
    Cases: state.Cases,
    Profile: state.Profile
})

const mapDispatchToProps = { DeleteCases, fillCasenotification }

export default connect(mapStateToProps, mapDispatchToProps)(CasesDelete)