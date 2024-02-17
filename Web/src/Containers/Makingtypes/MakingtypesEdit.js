import { connect } from 'react-redux'
import MakingtypesEdit from '../../Pages/Makingtypes/MakingtypesEdit'
import { EditMakingtypes, GetMakingtype, handleSelectedMakingtype, fillMakingtypenotification } from "../../Redux/MakingtypeSlice"

const mapStateToProps = (state) => ({
    Makingtypes: state.Makingtypes,
    Profile: state.Profile
})

const mapDispatchToProps = { EditMakingtypes, GetMakingtype, handleSelectedMakingtype, fillMakingtypenotification }

export default connect(mapStateToProps, mapDispatchToProps)(MakingtypesEdit)