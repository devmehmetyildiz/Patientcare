import { connect } from 'react-redux'
import PatienteventdefinesDelete from "../../Pages/Patienteventdefines/PatienteventdefinesDelete"
import { DeletePatienteventdefines, handleDeletemodal, handleSelectedPatienteventdefine } from "../../Redux/PatienteventdefineSlice"

const mapStateToProps = (state) => ({
    Patienteventdefines: state.Patienteventdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePatienteventdefines, handleDeletemodal, handleSelectedPatienteventdefine
}

export default connect(mapStateToProps, mapDispatchToProps)(PatienteventdefinesDelete)