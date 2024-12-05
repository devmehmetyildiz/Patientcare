import { connect } from 'react-redux'
import SurveysSavepreview from '../../Pages/Surveys/SurveysSavepreview'
import { SavepreviewSurveys, GetSurveys } from '../../Redux/SurveySlice'

const mapStateToProps = (state) => ({
    Surveys: state.Surveys,
    Profile: state.Profile
})

const mapDispatchToProps = {
    SavepreviewSurveys, GetSurveys
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveysSavepreview)