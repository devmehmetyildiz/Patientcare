import { connect } from 'react-redux'
import CostumertypesDelete from "../../Pages/Costumertypes/CostumertypesDelete"
import {
    DeleteCostumertypes, handleDeletemodal, handleSelectedCostumertype
} from "../../Redux/CostumertypeSlice"


const mapStateToProps = (state) => ({
    Costumertypes: state.Costumertypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteCostumertypes, handleDeletemodal, handleSelectedCostumertype
}

export default connect(mapStateToProps, mapDispatchToProps)(CostumertypesDelete)