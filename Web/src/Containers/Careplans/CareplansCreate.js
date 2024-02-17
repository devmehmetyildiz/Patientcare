import { connect } from 'react-redux'
import CareplansCreate from '../../Pages/Careplans/CareplansCreate'
import { AddCareplans, fillCareplannotification } from "../../Redux/CareplanSlice"
import { GetSupportplans } from "../../Redux/SupportplanSlice"
import { GetSupportplanlists } from "../../Redux/SupportplanlistSlice"
import { GetPatients } from "../../Redux/PatientSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetFiles } from "../../Redux/FileSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"
import { GetHelpstatus } from "../../Redux/HelpstatuSlice"
import { GetMakingtypes } from "../../Redux/MakingtypeSlice"
import { GetRatings } from "../../Redux/RatingSlice"
import { GetRequiredperiods } from "../../Redux/RequiredperiodSlice"

const mapStateToProps = (state) => ({
  Careplans: state.Careplans,
  Supportplans: state.Supportplans,
  Supportplanlists: state.Supportplanlists,
  Patients: state.Patients,
  Patientdefines: state.Patientdefines,
  Files: state.Files,
  Usagetypes: state.Usagetypes,
  Helpstatus: state.Helpstatus,
  Makingtypes: state.Makingtypes,
  Ratings: state.Ratings,
  Requiredperiods: state.Requiredperiods,
  Profile: state.Profile
})

const mapDispatchToProps = {
  AddCareplans, fillCareplannotification, GetSupportplans, GetUsagetypes,
  GetSupportplanlists, GetPatientdefines, GetPatients, GetFiles,
  GetHelpstatus, GetMakingtypes, GetRatings, GetRequiredperiods
}

export default connect(mapStateToProps, mapDispatchToProps)(CareplansCreate)