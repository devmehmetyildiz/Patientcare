import { connect } from 'react-redux'
import CareplansApprove from '../../Pages/Careplans/CareplansApprove'
import { ApproveCareplans, } from '../../Redux/CareplanSlice'

const mapStateToProps = (state) => ({
    Careplans: state.Careplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApproveCareplans,
}

export default connect(mapStateToProps, mapDispatchToProps)(CareplansApprove)