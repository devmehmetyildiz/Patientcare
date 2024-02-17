import { connect } from 'react-redux'
import CareplansApprove from '../../Pages/Careplans/CareplansApprove'
import { ApproveCareplans, handleApprovemodal, handleSelectedCareplan } from '../../Redux/CareplanSlice'

const mapStateToProps = (state) => ({
    Careplans: state.Careplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApproveCareplans, handleApprovemodal, handleSelectedCareplan
}

export default connect(mapStateToProps, mapDispatchToProps)(CareplansApprove)