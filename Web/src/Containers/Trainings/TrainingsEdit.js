import { connect } from 'react-redux'
import TrainingsEdit from '../../Pages/Trainings/TrainingsEdit'
import { EditTrainings, GetTraining, handleSelectedTraining, fillTrainingnotification } from '../../Redux/TrainingSlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetProfessions } from '../../Redux/ProfessionSlice'

const mapStateToProps = (state) => ({
    Trainings: state.Trainings,
    Users: state.Users,
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditTrainings, GetTraining, handleSelectedTraining, fillTrainingnotification,
    GetUsers, GetProfessions
}

export default connect(mapStateToProps, mapDispatchToProps)(TrainingsEdit)