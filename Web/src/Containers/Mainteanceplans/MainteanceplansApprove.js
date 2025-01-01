import { connect } from 'react-redux'
import MainteanceplansApprove from '../../Pages/Mainteanceplans/MainteanceplansApprove'
import { ApproveMainteanceplans } from '../../Redux/MainteanceplanSlice'

const mapStateToProps = (state) => ({
    Mainteanceplans: state.Mainteanceplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApproveMainteanceplans
}

export default connect(mapStateToProps, mapDispatchToProps)(MainteanceplansApprove)