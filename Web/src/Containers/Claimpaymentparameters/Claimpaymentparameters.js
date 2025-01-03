import { connect } from 'react-redux'
import Claimpaymentparameters from '../../Pages/Claimpaymentparameters/Claimpaymentparameters'
import { GetClaimpaymentparameters, } from '../../Redux/ClaimpaymentparameterSlice'
import { GetCostumertypes } from '../../Redux/CostumertypeSlice'

const mapStateToProps = (state) => ({
    Claimpaymentparameters: state.Claimpaymentparameters,
    Costumertypes: state.Costumertypes,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetClaimpaymentparameters, GetCostumertypes,
}

export default connect(mapStateToProps, mapDispatchToProps)(Claimpaymentparameters)