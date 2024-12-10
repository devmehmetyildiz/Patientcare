import { connect } from 'react-redux'
import PatientsEntereventModal from '../../Pages/Patients/PatientsEntereventModal'
import { AddPatienteventmovements, fillPatienteventmovementnotification } from '../../Redux/PatienteventmovementSlice'
import { GetPatient } from '../../Redux/PatientSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patienteventdefines: state.Patienteventdefines,
    Users: state.Users,
    Floors: state.Floors,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    AddPatienteventmovements, fillPatienteventmovementnotification,GetPatient
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEntereventModal)