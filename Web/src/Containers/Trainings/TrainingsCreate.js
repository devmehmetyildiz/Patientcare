import { connect } from 'react-redux'
import TrainingsCreate from '../../Pages/Trainings/TrainingsCreate'
import { AddTrainings, fillTrainingnotification } from '../../Redux/TrainingSlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetProfessions } from '../../Redux/ProfessionSlice'
import { GetUsagetypes } from '../../Redux/UsagetypeSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'

const mapStateToProps = (state) => ({
    Trainings: state.Trainings,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Users: state.Users,
    Usagetypes: state.Usagetypes,
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddTrainings, fillTrainingnotification, GetUsers, GetProfessions, GetUsagetypes,
    GetPatients, GetPatientdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(TrainingsCreate)