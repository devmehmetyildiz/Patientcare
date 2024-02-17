import { connect } from 'react-redux'
import Makingtypes from '../../Pages/Makingtypes/Makingtypes'
import { GetMakingtypes, handleDeletemodal, handleSelectedMakingtype } from "../../Redux/MakingtypeSlice"

const mapStateToProps = (state) => ({
    Makingtypes: state.Makingtypes,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetMakingtypes, handleDeletemodal, handleSelectedMakingtype
}

export default connect(mapStateToProps, mapDispatchToProps)(Makingtypes)