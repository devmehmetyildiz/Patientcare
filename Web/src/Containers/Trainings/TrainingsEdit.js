import { connect } from 'react-redux'
import TrainingsEdit from '../../Pages/Trainings/TrainingsEdit'
import { EditTrainings, GetTraining, handleSelectedTraining, fillTrainingnotification } from '../../Redux/TrainingSlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetProfessions } from '../../Redux/ProfessionSlice'
import { GetUsagetypes } from '../../Redux/UsagetypeSlice'
import { GetFiles } from '../../Redux/FileSlice'

const mapStateToProps = (state) => ({
    Trainings: state.Trainings,
    Users: state.Users,
    Professions: state.Professions,
    Files: state.Files,
    Usagetypes: state.Usagetypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditTrainings, GetTraining, handleSelectedTraining, fillTrainingnotification,
    GetUsers, GetProfessions, GetFiles, GetUsagetypes
}

export default connect(mapStateToProps, mapDispatchToProps)(TrainingsEdit)