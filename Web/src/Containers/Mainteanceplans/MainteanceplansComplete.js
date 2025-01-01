import { connect } from 'react-redux'
import MainteanceplansComplete from '../../Pages/Mainteanceplans/MainteanceplansComplete'
import { CompleteMainteanceplans } from '../../Redux/MainteanceplanSlice'

const mapStateToProps = (state) => ({
    Mainteanceplans: state.Mainteanceplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    CompleteMainteanceplans
}

export default connect(mapStateToProps, mapDispatchToProps)(MainteanceplansComplete)