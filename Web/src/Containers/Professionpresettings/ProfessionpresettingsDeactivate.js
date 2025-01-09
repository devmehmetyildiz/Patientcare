import { connect } from 'react-redux'
import ProfessionpresettingsDeactivate from "../../Pages/Professionpresettings/ProfessionpresettingsDeactivate"
import { DeactivateProfessionpresettings, } from "../../Redux/ProfessionpresettingSlice"

const mapStateToProps = (state) => ({
    Professionpresettings: state.Professionpresettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeactivateProfessionpresettings,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionpresettingsDeactivate)