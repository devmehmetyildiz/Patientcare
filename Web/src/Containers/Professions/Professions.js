import { connect } from 'react-redux'
import Professions from '../../Pages/Professions/Professions'
import { GetProfessions, handleDeletemodal, handleSelectedProfession } from "../../Redux/ProfessionSlice"
import { GetFloors } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Professions: state.Professions,
    Floors: state.Floors,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetProfessions, handleDeletemodal, handleSelectedProfession, GetFloors
}

export default connect(mapStateToProps, mapDispatchToProps)(Professions)