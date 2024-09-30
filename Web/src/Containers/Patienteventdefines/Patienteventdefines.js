import { connect } from 'react-redux'
import Patienteventdefines from "../../Pages/Patienteventdefines/Patienteventdefines"
import { GetPatienteventdefines, handleDeletemodal, handleSelectedPatienteventdefine } from "../../Redux/PatienteventdefineSlice"

const mapStateToProps = (state) => ({
  Patienteventdefines: state.Patienteventdefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetPatienteventdefines, handleDeletemodal, handleSelectedPatienteventdefine
}

export default connect(mapStateToProps, mapDispatchToProps)(Patienteventdefines)