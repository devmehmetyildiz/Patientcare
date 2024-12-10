import { connect } from 'react-redux'
import PatienteventmovementsDelete from "../../Pages/Patienteventmovements/PatienteventmovementsDelete"
import { DeletePatienteventmovements, GetPatienteventmovements } from "../../Redux/PatienteventmovementSlice"

const mapStateToProps = (state) => ({
    Patienteventmovements: state.Patienteventmovements,
    Patienteventdefines: state.Patienteventdefines,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePatienteventmovements, GetPatienteventmovements
}

export default connect(mapStateToProps, mapDispatchToProps)(PatienteventmovementsDelete)