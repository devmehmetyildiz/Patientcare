import { connect } from 'react-redux'
import MainteanciesComplete from '../../Pages/Mainteancies/MainteanciesComplete'
import { CompleteMainteancies, handleCompletemodal, handleSelectedMainteance } from '../../Redux/MainteanceSlice'

const mapStateToProps = (state) => ({
    Mainteancies: state.Mainteancies,
    Profile: state.Profile
})

const mapDispatchToProps = {
    CompleteMainteancies, handleCompletemodal, handleSelectedMainteance
}

export default connect(mapStateToProps, mapDispatchToProps)(MainteanciesComplete)