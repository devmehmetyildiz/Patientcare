import { connect } from 'react-redux'
import ClaimpaymentparametersActivate from '../../Pages/Claimpaymentparameters/ClaimpaymentparametersActivate'
import { ActivateClaimpaymentparameters, handleActivatemodal, handleSelectedClaimpaymentparameter } from '../../Redux/ClaimpaymentparameterSlice'

const mapStateToProps = (state) => ({
    Claimpaymentparameters: state.Claimpaymentparameters,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ActivateClaimpaymentparameters, handleActivatemodal, handleSelectedClaimpaymentparameter
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentparametersActivate)