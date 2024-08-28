import { connect } from 'react-redux'
import PatientsLeftModal from '../../Pages/Patients/PatientsLeftModal'
import { RemovePatients, fillPatientnotification } from '../../Redux/PatientSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Cases: state.Cases,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    RemovePatients, fillPatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsLeftModal)