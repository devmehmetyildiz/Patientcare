import { connect } from 'react-redux'
import { AddRules, removeRulenotification, fillRulenotification } from "../../Redux/RuleSlice"
import RulesCreate from '../../Pages/Rules/RulesCreate'

const mapStateToProps = (state) => ({
    Rules: state.Rules,
    Profile: state.Profile
})

const mapDispatchToProps = { AddRules, removeRulenotification, fillRulenotification }


export default connect(mapStateToProps, mapDispatchToProps)(RulesCreate)