import { connect } from 'react-redux'
import PersonelpresettingsDelete from "../../Pages/Personelpresettings/PersonelpresettingsDelete"
import { DeletePersonelpresettings } from "../../Redux/PersonelpresettingSlice"

const mapStateToProps = (state) => ({
    Personelpresettings: state.Personelpresettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePersonelpresettings
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelpresettingsDelete)