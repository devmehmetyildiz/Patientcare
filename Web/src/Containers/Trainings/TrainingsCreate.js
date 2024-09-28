import { connect } from 'react-redux'
import TrainingsCreate from '../../Pages/Trainings/TrainingsCreate'
import { AddTrainings, fillTrainingnotification } from '../../Redux/TrainingSlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetProfessions } from '../../Redux/ProfessionSlice'

const mapStateToProps = (state) => ({
    Trainings: state.Trainings,
    Users: state.Users,
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddTrainings, fillTrainingnotification, GetUsers, GetProfessions
}

export default connect(mapStateToProps, mapDispatchToProps)(TrainingsCreate)