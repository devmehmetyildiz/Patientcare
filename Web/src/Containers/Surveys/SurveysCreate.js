import { connect } from 'react-redux'
import SurveysCreate from '../../Pages/Surveys/SurveysCreate'
import { GetUsers } from '../../Redux/UserSlice'
import { AddSurveys,fillSurveynotification } from '../../Redux/SurveySlice'

const mapStateToProps = (state) => ({
    Surveys: state.Surveys,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetUsers, AddSurveys,fillSurveynotification
}


export default connect(mapStateToProps, mapDispatchToProps)(SurveysCreate)