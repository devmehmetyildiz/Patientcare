import { connect } from 'react-redux'
import ClaimpaymentparametersCreate from '../../Pages/Claimpaymentparameters/ClaimpaymentparametersCreate'
import { AddClaimpaymentparameters, fillClaimpaymentparameternotification } from '../../Redux/ClaimpaymentparameterSlice'
import { GetCostumertypes } from '../../Redux/CostumertypeSlice'

const mapStateToProps = (state) => ({
    Claimpaymentparameters: state.Claimpaymentparameters,
    Costumertypes: state.Costumertypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddClaimpaymentparameters, fillClaimpaymentparameternotification, GetCostumertypes
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentparametersCreate)