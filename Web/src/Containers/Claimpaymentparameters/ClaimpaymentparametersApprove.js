import { connect } from 'react-redux'
import ClaimpaymentparametersApprove from '../../Pages/Claimpaymentparameters/ClaimpaymentparametersApprove'
import { ApproveClaimpaymentparameters, } from '../../Redux/ClaimpaymentparameterSlice'

const mapStateToProps = (state) => ({
    Claimpaymentparameters: state.Claimpaymentparameters,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApproveClaimpaymentparameters
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentparametersApprove)