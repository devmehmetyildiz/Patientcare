import { connect } from 'react-redux'
import PatientcashmovementsEdit from '../../Pages/Patientcashmovements/PatientcashmovementsEdit'
import { EditPatientcashmovements, GetPatientcashmovement, fillPatientcashmovementnotification } from '../../Redux/PatientcashmovementSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetPatientcashregisters } from '../../Redux/PatientcashregisterSlice'

const mapStateToProps = (state) => ({
  Patientcashmovements: state.Patientcashmovements,
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Patientcashregisters: state.Patientcashregisters,
  Profile: state.Profile
})

const mapDispatchToProps = {
  EditPatientcashmovements, GetPatientcashmovement, fillPatientcashmovementnotification,
  GetPatients, GetPatientdefines, GetPatientcashregisters
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientcashmovementsEdit)