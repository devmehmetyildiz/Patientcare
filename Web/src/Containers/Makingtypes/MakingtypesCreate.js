import { connect } from 'react-redux'
import MakingtypesCreate from '../../Pages/Makingtypes/MakingtypesCreate'
import { AddMakingtypes, fillMakingtypenotification } from "../../Redux/MakingtypeSlice"

const mapStateToProps = (state) => ({
    Makingtypes: state.Makingtypes,
    Profile: state.Profile
})

const mapDispatchToProps = { AddMakingtypes, fillMakingtypenotification }

export default connect(mapStateToProps, mapDispatchToProps)(MakingtypesCreate)