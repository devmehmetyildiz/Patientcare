import { connect } from 'react-redux'
import SurveysDelete from '../../Pages/Surveys/SurveysDelete'
import { DeleteSurveys, GetSurveys } from '../../Redux/SurveySlice'

const mapStateToProps = (state) => ({
    Surveys: state.Surveys,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteSurveys, GetSurveys
}


export default connect(mapStateToProps, mapDispatchToProps)(SurveysDelete)