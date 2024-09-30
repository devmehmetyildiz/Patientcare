import { connect } from 'react-redux'
import PatienteventdefinesCreate from '../../Pages/Patienteventdefines/PatienteventdefinesCreate'
import { AddPatienteventdefines, fillPatienteventdefinenotification } from "../../Redux/PatienteventdefineSlice"

const mapStateToProps = (state) => ({
    Patienteventdefines: state.Patienteventdefines,
    Profile: state.Profile
})

const mapDispatchToProps = { AddPatienteventdefines, fillPatienteventdefinenotification }

export default connect(mapStateToProps, mapDispatchToProps)(PatienteventdefinesCreate)