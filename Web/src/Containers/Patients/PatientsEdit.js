import { connect } from 'react-redux'
import PatientsEdit from '../../Pages/Patients/PatientsEdit'
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { EditPatients, GetPatient, fillPatientnotification } from "../../Redux/PatientSlice"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Profile: state.Profile,
})

const mapDispatchToProps = {
  GetPatientdefines, GetPatient, EditPatients, fillPatientnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEdit)