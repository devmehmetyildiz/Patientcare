import { connect } from 'react-redux'
import ProfessionsEdit from '../../Pages/Professions/ProfessionsEdit'
import { EditProfessions, GetProfession, handleSelectedProfession, fillProfessionnotification } from "../../Redux/ProfessionSlice"

const mapStateToProps = (state) => ({
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = { EditProfessions, GetProfession, handleSelectedProfession, fillProfessionnotification }

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionsEdit)