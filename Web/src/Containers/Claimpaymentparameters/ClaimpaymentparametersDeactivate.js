import { connect } from 'react-redux'
import ClaimpaymentparametersDeactivate from '../../Pages/Claimpaymentparameters/ClaimpaymentparametersDeactivate'
import { DeactivateClaimpaymentparameters } from '../../Redux/ClaimpaymentparameterSlice'

const mapStateToProps = (state) => ({
    Claimpaymentparameters: state.Claimpaymentparameters,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeactivateClaimpaymentparameters
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentparametersDeactivate)