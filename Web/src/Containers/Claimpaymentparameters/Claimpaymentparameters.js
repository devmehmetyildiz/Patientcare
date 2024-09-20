import { connect } from 'react-redux'
import Claimpaymentparameters from '../../Pages/Claimpaymentparameters/Claimpaymentparameters'
import {
    GetClaimpaymentparameters, handleDeletemodal, handleActivatemodal, handleDeactivatemodal,
    handleSelectedClaimpaymentparameter, handleApprovemodal, handleSavepreviewmodal
} from '../../Redux/ClaimpaymentparameterSlice'
import { GetCostumertypes } from '../../Redux/CostumertypeSlice'

const mapStateToProps = (state) => ({
    Claimpaymentparameters: state.Claimpaymentparameters,
    Costumertypes: state.Costumertypes,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetClaimpaymentparameters, handleDeletemodal, handleSelectedClaimpaymentparameter, GetCostumertypes, handleApprovemodal,
    handleActivatemodal, handleDeactivatemodal, handleSavepreviewmodal
}

export default connect(mapStateToProps, mapDispatchToProps)(Claimpaymentparameters)