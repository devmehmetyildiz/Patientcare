import { connect } from 'react-redux'
import TrainingsComplete from '../../Pages/Trainings/TrainingsComplete'
import { CompleteTrainings, CompleteAllTrainings, handleCompletemodal, handleSelectedTraining } from '../../Redux/TrainingSlice'

const mapStateToProps = (state) => ({
    Trainings: state.Trainings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    CompleteTrainings, handleCompletemodal, handleSelectedTraining, CompleteAllTrainings
}

export default connect(mapStateToProps, mapDispatchToProps)(TrainingsComplete)