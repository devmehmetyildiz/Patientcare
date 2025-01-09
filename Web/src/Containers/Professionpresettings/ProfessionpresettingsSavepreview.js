import { connect } from 'react-redux'
import ProfessionpresettingsSavepreview from "../../Pages/Professionpresettings/ProfessionpresettingsSavepreview"
import { SavepreviewProfessionpresettings } from "../../Redux/ProfessionpresettingSlice"

const mapStateToProps = (state) => ({
    Professionpresettings: state.Professionpresettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    SavepreviewProfessionpresettings
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionpresettingsSavepreview)