import { connect } from 'react-redux'
import Mainteancies from "../../Pages/Mainteancies/Mainteancies"
import { GetMainteancies, handleDeletemodal, handleSelectedMainteance } from "../../Redux/MainteanceSlice"
import { GetPersonels } from '../../Redux/PersonelSlice'
import { GetEquipments } from '../../Redux/EquipmentSlice'

const mapStateToProps = (state) => ({
  Mainteancies: state.Mainteancies,
  Personels: state.Personels,
  Equipments: state.Equipments,
  Profile: state.Profile
})

const mapDispatchToProps = { GetMainteancies, handleDeletemodal, handleSelectedMainteance, GetPersonels, GetEquipments }

export default connect(mapStateToProps, mapDispatchToProps)(Mainteancies)