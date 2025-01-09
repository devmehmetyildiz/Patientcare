import { connect } from 'react-redux'
import PersonelpresettingsActivate from "../../Pages/Personelpresettings/PersonelpresettingsActivate"
import { ActivatePersonelpresettings, } from "../../Redux/PersonelpresettingSlice"

const mapStateToProps = (state) => ({
    Personelpresettings: state.Personelpresettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ActivatePersonelpresettings
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelpresettingsActivate)