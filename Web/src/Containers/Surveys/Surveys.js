import { connect } from 'react-redux'
import Surveys from '../../Pages/Surveys/Surveys'
import { GetSurveys, RemoveSurveyanswer, ClearSurvey } from '../../Redux/SurveySlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'

const mapStateToProps = (state) => ({
    Surveys: state.Surveys,
    Users: state.Users,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetSurveys, GetUsers, GetPatientdefines, GetPatients, RemoveSurveyanswer, ClearSurvey
}


export default connect(mapStateToProps, mapDispatchToProps)(Surveys)