import { connect } from 'react-redux'
import ProfessionpresettingsComplete from "../../Pages/Professionpresettings/ProfessionpresettingsComplete"
import { CompleteProfessionpresettings } from "../../Redux/ProfessionpresettingSlice"

const mapStateToProps = (state) => ({
    Professionpresettings: state.Professionpresettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    CompleteProfessionpresettings
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionpresettingsComplete)