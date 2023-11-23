import { connect } from 'react-redux'
import Personels from "../../Pages/Personels/Personels"
import { GetPersonels, handleDeletemodal, handleSelectedPersonel } from "../../Redux/PersonelSlice"

const mapStateToProps = (state) => ({
  Personels: state.Personels,
  Profile: state.Profile
})

const mapDispatchToProps = { GetPersonels, handleDeletemodal, handleSelectedPersonel }

export default connect(mapStateToProps, mapDispatchToProps)(Personels)