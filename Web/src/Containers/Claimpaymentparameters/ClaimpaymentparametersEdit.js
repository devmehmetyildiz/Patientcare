import { connect } from 'react-redux'
import ClaimpaymentparametersEdit from '../../Pages/Claimpaymentparameters/ClaimpaymentparametersEdit'
import { EditClaimpaymentparameters, GetClaimpaymentparameter, fillClaimpaymentparameternotification } from '../../Redux/ClaimpaymentparameterSlice'
import { GetCostumertypes } from '../../Redux/CostumertypeSlice'

const mapStateToProps = (state) => ({
    Claimpaymentparameters: state.Claimpaymentparameters,
    Costumertypes: state.Costumertypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditClaimpaymentparameters, GetClaimpaymentparameter, fillClaimpaymentparameternotification, GetCostumertypes
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentparametersEdit)