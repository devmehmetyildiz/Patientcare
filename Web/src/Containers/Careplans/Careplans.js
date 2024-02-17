import { connect } from 'react-redux'
import Careplans from "../../Pages/Careplans/Careplans"
import { GetCareplans, handleSelectedCareplan, handleDeletemodal, handleApprovemodal } from "../../Redux/CareplanSlice"
import { GetPatients } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"

const mapStateToProps = (state) => ({
  Careplans: state.Careplans,
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Profile: state.Profile,
})

const mapDispatchToProps = {
  GetCareplans, handleSelectedCareplan, handleDeletemodal, GetPatientdefines, GetPatients,handleApprovemodal
}

export default connect(mapStateToProps, mapDispatchToProps)(Careplans)