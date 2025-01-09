import { connect } from 'react-redux'
import Personelshifts from "../../Pages/Personelshifts/Personelshifts"
import { GetPersonelshifts, } from "../../Redux/PersonelshiftSlice"
import { GetProfessions } from "../../Redux/ProfessionSlice"

const mapStateToProps = (state) => ({
  Personelshifts: state.Personelshifts,
  Professions: state.Professions,
  Profile: state.Profile
})

const mapDispatchToProps = { GetPersonelshifts, GetProfessions }

export default connect(mapStateToProps, mapDispatchToProps)(Personelshifts)