import { connect } from 'react-redux'
import TrainingsSavepreview from '../../Pages/Trainings/TrainingsSavepreview'
import { SavepreviewTrainings, handleSavepreviewmodal, handleSelectedTraining } from '../../Redux/TrainingSlice'

const mapStateToProps = (state) => ({
    Trainings: state.Trainings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    SavepreviewTrainings, handleSavepreviewmodal, handleSelectedTraining
}

export default connect(mapStateToProps, mapDispatchToProps)(TrainingsSavepreview)