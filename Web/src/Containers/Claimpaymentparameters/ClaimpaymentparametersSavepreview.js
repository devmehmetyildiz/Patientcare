import { connect } from 'react-redux'
import ClaimpaymentparametersSavepreview from '../../Pages/Claimpaymentparameters/ClaimpaymentparametersSavepreview'
import { SavepreviewClaimpaymentparameters } from '../../Redux/ClaimpaymentparameterSlice'

const mapStateToProps = (state) => ({
    Claimpaymentparameters: state.Claimpaymentparameters,
    Profile: state.Profile
})

const mapDispatchToProps = {
    SavepreviewClaimpaymentparameters
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentparametersSavepreview)