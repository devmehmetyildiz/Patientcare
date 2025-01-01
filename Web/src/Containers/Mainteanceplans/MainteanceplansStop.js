import { connect } from 'react-redux'
import MainteanceplansStop from '../../Pages/Mainteanceplans/MainteanceplansStop'
import { StopMainteanceplans } from '../../Redux/MainteanceplanSlice'

const mapStateToProps = (state) => ({
    Mainteanceplans: state.Mainteanceplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    StopMainteanceplans
}

export default connect(mapStateToProps, mapDispatchToProps)(MainteanceplansStop)