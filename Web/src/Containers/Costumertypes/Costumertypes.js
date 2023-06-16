import { connect } from 'react-redux'
import Costumertypes from "../../Pages/Costumertypes/Costumertypes"
import {
  GetCostumertypes, DeleteCostumertypes, removeCostumertypenotification, fillCostumertypenotification
  , handleDeletemodal, handleSelectedCostumertype
} from "../../Redux/CostumertypeSlice"


const mapStateToProps = (state) => ({
  Costumertypes: state.Costumertypes,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetCostumertypes, DeleteCostumertypes, removeCostumertypenotification, fillCostumertypenotification,
  handleDeletemodal, handleSelectedCostumertype
}

export default connect(mapStateToProps, mapDispatchToProps)(Costumertypes)