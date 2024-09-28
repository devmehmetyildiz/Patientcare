import { connect } from 'react-redux'
import Trainings from '../../Pages/Trainings/Trainings'
import { GetTrainings, handleDeletemodal, handleCompletemodal, handleSavepreviewmodal, handleApprovemodal, handleSelectedTraining } from '../../Redux/TrainingSlice'
import { GetUsers } from '../../Redux/UserSlice'

const mapStateToProps = (state) => ({
    Trainings: state.Trainings,
    Users: state.Users,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetTrainings, handleDeletemodal, handleCompletemodal, handleSavepreviewmodal,
    handleApprovemodal, handleSelectedTraining, GetUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Trainings)