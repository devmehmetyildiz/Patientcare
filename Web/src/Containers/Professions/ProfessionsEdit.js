import { connect } from 'react-redux'
import ProfessionsEdit from '../../Pages/Professions/ProfessionsEdit'
import { EditProfessions, GetProfession, fillProfessionnotification } from "../../Redux/ProfessionSlice"
import { GetFloors } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Professions: state.Professions,
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = { EditProfessions, GetProfession, fillProfessionnotification, GetFloors }

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionsEdit)