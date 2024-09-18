import { connect } from 'react-redux'
import ClaimpaymentparametersDeactivate from '../../Pages/Claimpaymentparameters/ClaimpaymentparametersDeactivate'
import { DeactivateClaimpaymentparameters, handleDeactivatemodal, handleSelectedClaimpaymentparameter } from '../../Redux/ClaimpaymentparameterSlice'

const mapStateToProps = (state) => ({
    Claimpaymentparameters: state.Claimpaymentparameters,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeactivateClaimpaymentparameters, handleDeactivatemodal, handleSelectedClaimpaymentparameter
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentparametersDeactivate)