import { connect } from 'react-redux'
import ClaimpaymentparametersSavepreview from '../../Pages/Claimpaymentparameters/ClaimpaymentparametersSavepreview'
import { SavepreviewClaimpaymentparameters, handleSavepreviewmodal, handleSelectedClaimpaymentparameter } from '../../Redux/ClaimpaymentparameterSlice'

const mapStateToProps = (state) => ({
    Claimpaymentparameters: state.Claimpaymentparameters,
    Profile: state.Profile
})

const mapDispatchToProps = {
    SavepreviewClaimpaymentparameters, handleSavepreviewmodal, handleSelectedClaimpaymentparameter
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentparametersSavepreview)