import { connect } from 'react-redux'
import PersonelsDelete from "../../Pages/Personels/PersonelsDelete"
import { DeletePersonels, handleDeletemodal, handleSelectedPersonel } from "../../Redux/PersonelSlice"

const mapStateToProps = (state) => ({
    Personels: state.Personels,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePersonels, handleDeletemodal, handleSelectedPersonel
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelsDelete)