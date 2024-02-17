import { connect } from 'react-redux'
import MakingtypesDelete from '../../Pages/Makingtypes/MakingtypesDelete'
import { DeleteMakingtypes, handleDeletemodal, handleSelectedMakingtype } from "../../Redux/MakingtypeSlice"

const mapStateToProps = (state) => ({
    Makingtypes: state.Makingtypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteMakingtypes, handleDeletemodal, handleSelectedMakingtype
}

export default connect(mapStateToProps, mapDispatchToProps)(MakingtypesDelete)