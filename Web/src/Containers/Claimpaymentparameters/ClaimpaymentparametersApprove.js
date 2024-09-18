import { connect } from 'react-redux'
import ClaimpaymentparametersApprove from '../../Pages/Claimpaymentparameters/ClaimpaymentparametersApprove'
import { ApproveClaimpaymentparameters, handleApprovemodal, handleSelectedClaimpaymentparameter } from '../../Redux/ClaimpaymentparameterSlice'

const mapStateToProps = (state) => ({
    Claimpaymentparameters: state.Claimpaymentparameters,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApproveClaimpaymentparameters, handleApprovemodal, handleSelectedClaimpaymentparameter
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentparametersApprove)