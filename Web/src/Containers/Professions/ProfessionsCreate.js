import { connect } from 'react-redux'
import ProfessionsCreate from '../../Pages/Professions/ProfessionsCreate'
import { AddProfessions, fillProfessionnotification } from "../../Redux/ProfessionSlice"

const mapStateToProps = (state) => ({
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {AddProfessions, fillProfessionnotification }

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionsCreate)