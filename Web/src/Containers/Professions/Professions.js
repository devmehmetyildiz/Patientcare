import { connect } from 'react-redux'
import Professions from '../../Pages/Professions/Professions'
import { GetProfessions } from "../../Redux/ProfessionSlice"
import { GetFloors } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Professions: state.Professions,
    Floors: state.Floors,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetProfessions, GetFloors
}

export default connect(mapStateToProps, mapDispatchToProps)(Professions)