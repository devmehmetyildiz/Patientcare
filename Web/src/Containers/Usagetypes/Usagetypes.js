import { connect } from 'react-redux'
import Usagetypes from "../../Pages/Usagetypes/Usagetypes"
import { GetUsagetypes, handleDeletemodal, handleSelectedUsagetype } from "../../Redux/UsagetypeSlice"

const mapStateToProps = (state) => ({
  Usagetypes: state.Usagetypes,
  Profile: state.Profile
})

const mapDispatchToProps = { GetUsagetypes, handleDeletemodal, handleSelectedUsagetype }

export default connect(mapStateToProps, mapDispatchToProps)(Usagetypes)