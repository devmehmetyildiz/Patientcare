import { connect } from 'react-redux'
import { AddRules,  fillRulenotification } from "../../Redux/RuleSlice"
import RulesCreate from '../../Pages/Rules/RulesCreate'

const mapStateToProps = (state) => ({
    Rules: state.Rules,
    Profile: state.Profile
})

const mapDispatchToProps = { AddRules,  fillRulenotification }


export default connect(mapStateToProps, mapDispatchToProps)(RulesCreate)