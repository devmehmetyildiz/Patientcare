import { connect } from 'react-redux'
import SurveysComplete from '../../Pages/Surveys/SurveysComplete'
import { CompleteSurveys, GetSurveys } from '../../Redux/SurveySlice'

const mapStateToProps = (state) => ({
    Surveys: state.Surveys,
    Profile: state.Profile
})

const mapDispatchToProps = {
    CompleteSurveys, GetSurveys
}


export default connect(mapStateToProps, mapDispatchToProps)(SurveysComplete)