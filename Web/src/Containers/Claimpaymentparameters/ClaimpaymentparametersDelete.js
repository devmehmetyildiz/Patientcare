import { connect } from 'react-redux'
import ClaimpaymentparametersDelete from '../../Pages/Claimpaymentparameters/ClaimpaymentparametersDelete'
import { DeleteClaimpaymentparameters } from '../../Redux/ClaimpaymentparameterSlice'

const mapStateToProps = (state) => ({
    Claimpaymentparameters: state.Claimpaymentparameters,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteClaimpaymentparameters
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentparametersDelete)