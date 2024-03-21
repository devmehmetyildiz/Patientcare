import { connect } from 'react-redux'
import ProfessionsCreate from '../../Pages/Professions/ProfessionsCreate'
import { AddProfessions, fillProfessionnotification } from "../../Redux/ProfessionSlice"
import { GetFloors } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Professions: state.Professions,
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = { AddProfessions, fillProfessionnotification, GetFloors }

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionsCreate)