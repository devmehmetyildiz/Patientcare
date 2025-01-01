import { connect } from 'react-redux'
import MainteanceplansSavepreview from '../../Pages/Mainteanceplans/MainteanceplansSavepreview'
import { SavepreviewMainteanceplans } from '../../Redux/MainteanceplanSlice'

const mapStateToProps = (state) => ({
    Mainteanceplans: state.Mainteanceplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    SavepreviewMainteanceplans
}

export default connect(mapStateToProps, mapDispatchToProps)(MainteanceplansSavepreview)