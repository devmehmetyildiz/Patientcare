import { connect } from 'react-redux'
import PersonelpresettingsDeactivate from "../../Pages/Personelpresettings/PersonelpresettingsDeactivate"
import { DeactivatePersonelpresettings, } from "../../Redux/PersonelpresettingSlice"

const mapStateToProps = (state) => ({
    Personelpresettings: state.Personelpresettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeactivatePersonelpresettings,
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelpresettingsDeactivate)