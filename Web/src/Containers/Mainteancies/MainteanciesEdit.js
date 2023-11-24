import { connect } from 'react-redux'
import MainteanciesEdit from '../../Pages/Mainteancies/MainteanciesEdit'
import { EditMainteancies, GetMaineance, fillMainteancenotification } from "../../Redux/MainteanceSlice"
import { GetEquipments } from '../../Redux/EquipmentSlice'
import { GetEquipmentgroups } from '../../Redux/EquipmentgroupSlice'
import { GetPersonels } from '../../Redux/PersonelSlice'

const mapStateToProps = (state) => ({
    Mainteancies: state.Mainteancies,
    Personels: state.Personels,
    Equipments: state.Equipments,
    Equipmentgroups: state.Equipmentgroups,
    Profile: state.Profile
})

const mapDispatchToProps = { EditMainteancies, GetMaineance, fillMainteancenotification, GetEquipments, GetEquipmentgroups, GetPersonels }

export default connect(mapStateToProps, mapDispatchToProps)(MainteanciesEdit)