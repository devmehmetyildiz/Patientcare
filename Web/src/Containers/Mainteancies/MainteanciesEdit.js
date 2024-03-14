import { connect } from 'react-redux'
import MainteanciesEdit from '../../Pages/Mainteancies/MainteanciesEdit'
import { EditMainteancies, GetMaineance, fillMainteancenotification } from "../../Redux/MainteanceSlice"
import { GetEquipments } from '../../Redux/EquipmentSlice'
import { GetEquipmentgroups } from '../../Redux/EquipmentgroupSlice'
import { GetUsers } from '../../Redux/UserSlice'

const mapStateToProps = (state) => ({
    Mainteancies: state.Mainteancies,
    Users: state.Users,
    Equipments: state.Equipments,
    Equipmentgroups: state.Equipmentgroups,
    Profile: state.Profile
})

const mapDispatchToProps = { EditMainteancies, GetMaineance, fillMainteancenotification, GetEquipments, GetEquipmentgroups, GetUsers }

export default connect(mapStateToProps, mapDispatchToProps)(MainteanciesEdit)