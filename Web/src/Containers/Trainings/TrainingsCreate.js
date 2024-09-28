import { connect } from 'react-redux'
import TrainingsCreate from '../../Pages/Trainings/TrainingsCreate'
import { AddTrainings, fillTrainingnotification } from '../../Redux/TrainingSlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetProfessions } from '../../Redux/ProfessionSlice'
import { GetUsagetypes } from '../../Redux/UsagetypeSlice'

const mapStateToProps = (state) => ({
    Trainings: state.Trainings,
    Users: state.Users,
    Usagetypes: state.Usagetypes,
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddTrainings, fillTrainingnotification, GetUsers, GetProfessions, GetUsagetypes
}

export default connect(mapStateToProps, mapDispatchToProps)(TrainingsCreate)