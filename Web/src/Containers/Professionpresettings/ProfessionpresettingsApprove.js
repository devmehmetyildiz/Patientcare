import { connect } from 'react-redux'
import ProfessionpresettingsApprove from "../../Pages/Professionpresettings/ProfessionpresettingsApprove"
import { ApproveProfessionpresettings } from "../../Redux/ProfessionpresettingSlice"

const mapStateToProps = (state) => ({
    Professionpresettings: state.Professionpresettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApproveProfessionpresettings
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionpresettingsApprove)