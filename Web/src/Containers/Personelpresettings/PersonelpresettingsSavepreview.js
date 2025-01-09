import { connect } from 'react-redux'
import PersonelpresettingsSavepreview from "../../Pages/Personelpresettings/PersonelpresettingsSavepreview"
import { SavepreviewPersonelpresettings } from "../../Redux/PersonelpresettingSlice"

const mapStateToProps = (state) => ({
    Personelpresettings: state.Personelpresettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    SavepreviewPersonelpresettings
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelpresettingsSavepreview)