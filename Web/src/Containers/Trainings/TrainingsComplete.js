import { connect } from 'react-redux'
import TrainingsComplete from '../../Pages/Trainings/TrainingsComplete'
import { CompleteTrainings, handleCompletemodal, handleSelectedTraining } from '../../Redux/TrainingSlice'

const mapStateToProps = (state) => ({
    Trainings: state.Trainings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    CompleteTrainings, handleCompletemodal, handleSelectedTraining
}

export default connect(mapStateToProps, mapDispatchToProps)(TrainingsComplete)