import { connect } from 'react-redux'
import SurveysFill from '../../Pages/Surveys/SurveysFill'
import { FillSurveys, fillSurveynotification, GetSurveys } from '../../Redux/SurveySlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetUsers } from '../../Redux/UserSlice'

const mapStateToProps = (state) => ({
    Surveys: state.Surveys,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    FillSurveys, GetPatientdefines, GetPatients, GetUsers, fillSurveynotification, GetSurveys
}


export default connect(mapStateToProps, mapDispatchToProps)(SurveysFill)