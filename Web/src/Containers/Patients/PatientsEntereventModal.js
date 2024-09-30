import { connect } from 'react-redux'
import PatientsEntereventModal from '../../Pages/Patients/PatientsEntereventModal'
import { AddPatienteventmovements, fillPatientnotification } from '../../Redux/PatientSlice'
import { GetPatienteventdefines } from '../../Redux/PatienteventdefineSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patienteventdefines: state.Patienteventdefines,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    AddPatienteventmovements, fillPatientnotification, GetPatienteventdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEntereventModal)