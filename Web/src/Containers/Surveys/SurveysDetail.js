import { connect } from 'react-redux'
import SurveysDetail from '../../Pages/Surveys/SurveysDetail'

const mapStateToProps = (state) => ({
    Surveys: state.Surveys,
    Profile: state.Profile
})

const mapDispatchToProps = {
}


export default connect(mapStateToProps, mapDispatchToProps)(SurveysDetail)