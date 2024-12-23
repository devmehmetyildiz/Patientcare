import { connect } from 'react-redux'
import Patienthealtcasedefines from "../../Pages/Patienthealthcasedefines/Patienthealthcasedefines"
import { GetPatienthealthcasedefines, handleDeletemodal, handleSelectedPatienthealthcasedefine } from "../../Redux/PatienthealthcasedefineSlice"

const mapStateToProps = (state) => ({
  Patienthealthcasedefines: state.Patienthealthcasedefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetPatienthealthcasedefines, handleDeletemodal, handleSelectedPatienthealthcasedefine
}

export default connect(mapStateToProps, mapDispatchToProps)(Patienthealtcasedefines)