import { connect } from 'react-redux'
import RulesLog from "../../Pages/Rules/RulesLog"
import { ClearRulelogs, GetRulelogswithoutloading } from "../../Redux/RuleSlice"

const mapStateToProps = (state) => ({
    Rules: state.Rules,
    Profile: state.Profile
})

const mapDispatchToProps = { ClearRulelogs, GetRulelogswithoutloading }

export default connect(mapStateToProps, mapDispatchToProps)(RulesLog)