import { connect } from 'react-redux'
import Personelshifts from "../../Pages/Personelshifts/Personelshifts"
import { GetPersonelshifts, handleDeletemodal, handleSelectedPersonelshift } from "../../Redux/PersonelshiftSlice"

const mapStateToProps = (state) => ({
  Personelshifts: state.Personelshifts,
  Profile: state.Profile
})

const mapDispatchToProps = { GetPersonelshifts, handleDeletemodal, handleSelectedPersonelshift }

export default connect(mapStateToProps, mapDispatchToProps)(Personelshifts)