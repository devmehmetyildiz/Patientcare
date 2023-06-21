import { connect } from 'react-redux'
import RulesLog from "../../Pages/Rules/RulesLog"
import { handleLogmodal, ClearRulelogs, GetRulelogswithoutloading } from "../../Redux/RuleSlice"

const mapStateToProps = (state) => ({
    Rules: state.Rules,
    Profile: state.Profile
})

const mapDispatchToProps = { handleLogmodal, ClearRulelogs, GetRulelogswithoutloading }

export default connect(mapStateToProps, mapDispatchToProps)(RulesLog)