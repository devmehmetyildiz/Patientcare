import { connect } from 'react-redux'
import ProfessionpresettingsActivate from "../../Pages/Professionpresettings/ProfessionpresettingsActivate"
import { ActivateProfessionpresettings, } from "../../Redux/ProfessionpresettingSlice"

const mapStateToProps = (state) => ({
    Professionpresettings: state.Professionpresettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ActivateProfessionpresettings
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionpresettingsActivate)