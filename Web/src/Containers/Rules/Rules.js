import { connect } from 'react-redux'
import Rules from "../../Pages/Rules/Rules"
import { GetRules, GetRulelogs, StopRules } from "../../Redux/RuleSlice"

const mapStateToProps = (state) => ({
  Rules: state.Rules,
  Profile: state.Profile
})

const mapDispatchToProps = { GetRules, GetRulelogs, StopRules }

export default connect(mapStateToProps, mapDispatchToProps)(Rules)