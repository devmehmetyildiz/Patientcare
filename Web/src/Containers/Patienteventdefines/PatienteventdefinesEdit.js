import { connect } from 'react-redux'
import PatienteventdefinesEdit from '../../Pages/Patienteventdefines/PatienteventdefinesEdit'
import { EditPatienteventdefines, GetPatienteventdefine, fillPatienteventdefinenotification } from "../../Redux/PatienteventdefineSlice"

const mapStateToProps = (state) => ({
    Patienteventdefines: state.Patienteventdefines,
    Profile: state.Profile
})

const mapDispatchToProps = { EditPatienteventdefines, GetPatienteventdefine, fillPatienteventdefinenotification }

export default connect(mapStateToProps, mapDispatchToProps)(PatienteventdefinesEdit)