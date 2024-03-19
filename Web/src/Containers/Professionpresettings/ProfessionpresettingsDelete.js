import { connect } from 'react-redux'
import ProfessionpresettingsDelete from "../../Pages/Professionpresettings/ProfessionpresettingsDelete"
import { DeleteProfessionpresettings, handleDeletemodal, handleSelectedProfessionpresetting } from "../../Redux/ProfessionpresettingSlice"

const mapStateToProps = (state) => ({
    Professionpresettings: state.Professionpresettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteProfessionpresettings, handleDeletemodal, handleSelectedProfessionpresetting
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionpresettingsDelete)