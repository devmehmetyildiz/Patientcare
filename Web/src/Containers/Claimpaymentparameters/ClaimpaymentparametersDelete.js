import { connect } from 'react-redux'
import ClaimpaymentparametersDelete from '../../Pages/Claimpaymentparameters/ClaimpaymentparametersDelete'
import { DeleteClaimpaymentparameters, handleDeletemodal, handleSelectedClaimpaymentparameter } from '../../Redux/ClaimpaymentparameterSlice'

const mapStateToProps = (state) => ({
    Claimpaymentparameters: state.Claimpaymentparameters,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteClaimpaymentparameters, handleDeletemodal, handleSelectedClaimpaymentparameter
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentparametersDelete)