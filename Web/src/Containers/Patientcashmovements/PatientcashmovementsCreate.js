import { connect } from 'react-redux'
import PatientcashmovementsCreate from '../../Pages/Patientcashmovements/PatientcashmovementsCreate'
import { AddPatientcashmovements, fillPatientcashmovementnotification } from '../../Redux/PatientcashmovementSlice'
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

const mapDispatchToProps = { AddPatientcashmovements, fillPatientcashmovementnotification, GetPatients, GetPatientdefines, GetPatientcashregisters }

export default connect(mapStateToProps, mapDispatchToProps)(PatientcashmovementsCreate)