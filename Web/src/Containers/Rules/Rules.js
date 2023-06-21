import { connect } from 'react-redux'
import Rules from "../../Pages/Rules/Rules"
import { GetRules, removeRulenotification, handleDeletemodal, handleSelectedRule, handleLogmodal, GetRulelogs, StopRules } from "../../Redux/RuleSlice"

const mapStateToProps = (state) => ({
  Rules: state.Rules,
  Profile: state.Profile
})

const mapDispatchToProps = { GetRules, removeRulenotification, handleDeletemodal, handleSelectedRule, GetRulelogs, handleLogmodal, StopRules }

export default connect(mapStateToProps, mapDispatchToProps)(Rules)