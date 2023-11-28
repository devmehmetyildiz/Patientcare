import { connect } from 'react-redux'
import MainteanciesDelete from "../../Pages/Mainteancies/MainteanciesDelete"
import { DeleteMainteancies, handleDeletemodal, handleSelectedMainteance } from "../../Redux/MainteanceSlice"

const mapStateToProps = (state) => ({
    Mainteancies: state.Mainteancies,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteMainteancies, handleDeletemodal, handleSelectedMainteance
}

export default connect(mapStateToProps, mapDispatchToProps)(MainteanciesDelete)