import { connect } from 'react-redux'
import Mainteancies from "../../Pages/Mainteancies/Mainteancies"
import { GetMainteancies, fillMainteancenotification, handleCompletemodal, handleDeletemodal, handleSelectedMainteance } from "../../Redux/MainteanceSlice"
import { GetUsers } from '../../Redux/UserSlice'
import { GetEquipments } from '../../Redux/EquipmentSlice'

const mapStateToProps = (state) => ({
  Mainteancies: state.Mainteancies,
  Users: state.Users,
  Equipments: state.Equipments,
  Profile: state.Profile
})

const mapDispatchToProps = { GetMainteancies, handleDeletemodal, handleSelectedMainteance, GetUsers, GetEquipments, fillMainteancenotification, handleCompletemodal }

export default connect(mapStateToProps, mapDispatchToProps)(Mainteancies)