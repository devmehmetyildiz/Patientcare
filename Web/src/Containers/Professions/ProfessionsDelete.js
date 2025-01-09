import { connect } from 'react-redux'
import ProfessionsDelete from '../../Pages/Professions/ProfessionsDelete'
import { DeleteProfessions } from "../../Redux/ProfessionSlice"

const mapStateToProps = (state) => ({
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteProfessions
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionsDelete)