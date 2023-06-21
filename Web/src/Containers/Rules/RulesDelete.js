import { connect } from 'react-redux'
import RulesDelete from "../../Pages/Rules/RulesDelete"
import { DeleteRules, handleDeletemodal, handleSelectedRule } from "../../Redux/RuleSlice"

const mapStateToProps = (state) => ({
    Rules: state.Rules,
    Profile: state.Profile
})

const mapDispatchToProps = { DeleteRules, handleDeletemodal, handleSelectedRule }

export default connect(mapStateToProps, mapDispatchToProps)(RulesDelete)