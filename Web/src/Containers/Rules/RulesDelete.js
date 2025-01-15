import { connect } from 'react-redux'
import RulesDelete from "../../Pages/Rules/RulesDelete"
import { DeleteRules, } from "../../Redux/RuleSlice"

const mapStateToProps = (state) => ({
    Rules: state.Rules,
    Profile: state.Profile
})

const mapDispatchToProps = { DeleteRules, }

export default connect(mapStateToProps, mapDispatchToProps)(RulesDelete)