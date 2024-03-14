import { connect } from 'react-redux'
import Professions from '../../Pages/Professions/Professions'
import { GetProfessions, handleDeletemodal, handleSelectedProfession } from "../../Redux/ProfessionSlice"

const mapStateToProps = (state) => ({
    Professions: state.Professions,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetProfessions, handleDeletemodal, handleSelectedProfession
}

export default connect(mapStateToProps, mapDispatchToProps)(Professions)