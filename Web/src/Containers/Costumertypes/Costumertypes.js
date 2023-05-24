import { connect } from 'react-redux'
import Costumertypes from "../../Pages/Costumertypes/Costumertypes"
import { GetCostumertypes, DeleteCostumertypes, removeCostumertypenotification, fillCostumertypenotification } from "../../Redux/Actions/CostumertypeAction"


const mapStateToProps = (state) => ({
  Costumertypes:state.Costumertypes,
  Profile: state.Profile
})

const mapDispatchToProps = {GetCostumertypes, DeleteCostumertypes, removeCostumertypenotification, fillCostumertypenotification}

export default connect(mapStateToProps, mapDispatchToProps)(Costumertypes)