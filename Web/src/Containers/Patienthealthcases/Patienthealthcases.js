import { connect } from 'react-redux'
import Patienthealthcases from "../../Pages/Patienthealthcases/Patienthealthcases"
import { GetPatienthealthcases } from "../../Redux/PatienthealthcaseSlice"
import { GetPatienthealthcasedefines } from '../../Redux/PatienthealthcasedefineSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'

const mapStateToProps = (state) => ({
  Patienthealthcases: state.Patienthealthcases,
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Patienthealthcasedefines: state.Patienthealthcasedefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetPatienthealthcases, GetPatienthealthcasedefines, GetPatientdefines, GetPatients
}

export default connect(mapStateToProps, mapDispatchToProps)(Patienthealthcases)