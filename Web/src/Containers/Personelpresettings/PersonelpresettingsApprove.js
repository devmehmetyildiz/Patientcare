import { connect } from 'react-redux'
import PersonelpresettingsApprove from "../../Pages/Personelpresettings/PersonelpresettingsApprove"
import { ApprovePersonelpresettings } from "../../Redux/PersonelpresettingSlice"

const mapStateToProps = (state) => ({
    Personelpresettings: state.Personelpresettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApprovePersonelpresettings
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelpresettingsApprove)