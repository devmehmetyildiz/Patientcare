import { connect } from 'react-redux'
import CareplansEdit from '../../Pages/Careplans/CareplansEdit'
import { EditCareplans, GetCareplan, handleSelectedCareplan, fillCareplannotification } from "../../Redux/CareplanSlice"
import { GetSupportplans } from "../../Redux/SupportplanSlice"
import { GetSupportplanlists } from "../../Redux/SupportplanlistSlice"
import { GetPatients } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"

const mapStateToProps = (state) => ({
  Careplans: state.Careplans,
  Supportplans: state.Supportplans,
  Supportplanlists: state.Supportplanlists,
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  EditCareplans, GetCareplan, handleSelectedCareplan, fillCareplannotification,
  GetSupportplanlists, GetSupportplans, GetPatients, GetPatientdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(CareplansEdit)