import { connect } from 'react-redux'
import PersonelpresettingsComplete from "../../Pages/Personelpresettings/PersonelpresettingsComplete"
import { CompletePersonelpresettings } from "../../Redux/PersonelpresettingSlice"

const mapStateToProps = (state) => ({
    Personelpresettings: state.Personelpresettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    CompletePersonelpresettings
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelpresettingsComplete)