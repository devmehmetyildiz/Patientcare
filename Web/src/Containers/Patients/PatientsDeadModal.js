import { connect } from 'react-redux'
import PatientsDeadModal from '../../Pages/Patients/PatientsDeadModal'
import { DeadPatients, fillPatientnotification } from '../../Redux/PatientSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Cases: state.Cases,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    DeadPatients, fillPatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsDeadModal)