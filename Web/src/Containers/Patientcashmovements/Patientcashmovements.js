import { connect } from 'react-redux'
import Patientcashmovements from '../../Pages/Patientcashmovements/Patientcashmovements'
import { GetPatientcashmovements, handleDeletemodal, handleSelectedPatientcashmovement } from '../../Redux/PatientcashmovementSlice'
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
  GetPatientcashmovements, handleDeletemodal, handleSelectedPatientcashmovement, GetPatients, GetPatientdefines, GetPatientcashregisters
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientcashmovements)