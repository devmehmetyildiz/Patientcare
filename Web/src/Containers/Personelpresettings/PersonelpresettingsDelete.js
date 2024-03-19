import { connect } from 'react-redux'
import PersonelpresettingsDelete from "../../Pages/Personelpresettings/PersonelpresettingsDelete"
import { DeletePersonelpresettings, handleDeletemodal, handleSelectedPersonelpresetting } from "../../Redux/PersonelpresettingSlice"

const mapStateToProps = (state) => ({
    Personelpresettings: state.Personelpresettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePersonelpresettings, handleDeletemodal, handleSelectedPersonelpresetting
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelpresettingsDelete)