import { connect } from 'react-redux'
import CareplansCreate from '../../Pages/Careplans/CareplansCreate'
import { AddCareplans, fillCareplannotification } from "../../Redux/CareplanSlice"
import { GetSupportplans } from "../../Redux/SupportplanSlice"
import { GetSupportplanlists } from "../../Redux/SupportplanlistSlice"
import { GetPatients } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetFiles } from "../../Redux/FileSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"
import { GetCareplanparameters } from "../../Redux/CareplanparameterSlice"

const mapStateToProps = (state) => ({
  Careplans: state.Careplans,
  Supportplans: state.Supportplans,
  Supportplanlists: state.Supportplanlists,
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Files: state.Files,
  Usagetypes: state.Usagetypes,
  Careplanparameters: state.Careplanparameters,
  Profile: state.Profile
})

const mapDispatchToProps = {
  AddCareplans, fillCareplannotification, GetSupportplans, GetUsagetypes,
  GetSupportplanlists, GetPatientdefines, GetPatients, GetFiles, GetCareplanparameters
}

export default connect(mapStateToProps, mapDispatchToProps)(CareplansCreate)