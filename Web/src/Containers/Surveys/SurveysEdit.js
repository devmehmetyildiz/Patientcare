import { connect } from 'react-redux'
import SurveysEdit from '../../Pages/Surveys/SurveysEdit'
import { GetUsers } from '../../Redux/UserSlice'
import { EditSurveys, GetSurvey, fillSurveynotification, } from '../../Redux/SurveySlice'

const mapStateToProps = (state) => ({
    Surveys: state.Surveys,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetUsers, EditSurveys, GetSurvey, fillSurveynotification
}


export default connect(mapStateToProps, mapDispatchToProps)(SurveysEdit)