import { connect } from 'react-redux'
import ProfessionsDelete from '../../Pages/Professions/ProfessionsDelete'
import { DeleteProfessions, handleDeletemodal, handleSelectedProfession } from "../../Redux/ProfessionSlice"

const mapStateToProps = (state) => ({
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteProfessions, handleDeletemodal, handleSelectedProfession 
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionsDelete)