import { connect } from 'react-redux'
import MainteanceplansWork from '../../Pages/Mainteanceplans/MainteanceplansWork'
import { WorkMainteanceplans } from '../../Redux/MainteanceplanSlice'

const mapStateToProps = (state) => ({
    Mainteanceplans: state.Mainteanceplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    WorkMainteanceplans
}

export default connect(mapStateToProps, mapDispatchToProps)(MainteanceplansWork)