import { connect } from 'react-redux'
import TrainingsDelete from '../../Pages/Trainings/TrainingsDelete'
import { DeleteTrainings, handleDeletemodal, handleSelectedTraining } from '../../Redux/TrainingSlice'

const mapStateToProps = (state) => ({
    Trainings: state.Trainings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteTrainings, handleDeletemodal, handleSelectedTraining
}

export default connect(mapStateToProps, mapDispatchToProps)(TrainingsDelete)