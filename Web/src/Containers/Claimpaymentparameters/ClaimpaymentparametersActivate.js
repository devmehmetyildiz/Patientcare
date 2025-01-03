import { connect } from 'react-redux'
import ClaimpaymentparametersActivate from '../../Pages/Claimpaymentparameters/ClaimpaymentparametersActivate'
import { ActivateClaimpaymentparameters } from '../../Redux/ClaimpaymentparameterSlice'

const mapStateToProps = (state) => ({
    Claimpaymentparameters: state.Claimpaymentparameters,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ActivateClaimpaymentparameters
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentparametersActivate)