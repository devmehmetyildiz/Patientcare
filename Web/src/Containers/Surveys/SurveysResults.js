import { connect } from 'react-redux'
import Surveys from '../../Pages/Surveys/SurveysResults'

const mapStateToProps = (state) => ({
    Surveys: state.Surveys,
    Profile: state.Profile
})

const mapDispatchToProps = {
}


export default connect(mapStateToProps, mapDispatchToProps)(Surveys)