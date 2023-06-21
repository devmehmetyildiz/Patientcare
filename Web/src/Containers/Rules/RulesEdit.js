import { connect } from 'react-redux'
import RulesEdit from '../../Pages/Rules/RulesEdit'
import { GetRule, EditRules, removeRulenotification, fillRulenotification, ClearRulelogs, GetRulelogs } from "../../Redux/RuleSlice"

const mapStateToProps = (state) => ({
    Rules: state.Rules,
    Profile: state.Profile
})

const mapDispatchToProps = { GetRule, EditRules, removeRulenotification, fillRulenotification, ClearRulelogs, GetRulelogs }

export default connect(mapStateToProps, mapDispatchToProps)(RulesEdit)