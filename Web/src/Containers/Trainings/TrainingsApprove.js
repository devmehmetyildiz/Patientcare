import { connect } from 'react-redux'
import TrainingsApprove from '../../Pages/Trainings/TrainingsApprove'
import { ApproveTrainings, handleApprovemodal, handleSelectedTraining } from '../../Redux/TrainingSlice'

const mapStateToProps = (state) => ({
    Trainings: state.Trainings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApproveTrainings, handleApprovemodal, handleSelectedTraining
}

export default connect(mapStateToProps, mapDispatchToProps)(TrainingsApprove)