import { connect } from 'react-redux'
import SurveysApprove from '../../Pages/Surveys/SurveysApprove'
import { ApproveSurveys, GetSurveys } from '../../Redux/SurveySlice'

const mapStateToProps = (state) => ({
    Surveys: state.Surveys,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApproveSurveys, GetSurveys
}


export default connect(mapStateToProps, mapDispatchToProps)(SurveysApprove)